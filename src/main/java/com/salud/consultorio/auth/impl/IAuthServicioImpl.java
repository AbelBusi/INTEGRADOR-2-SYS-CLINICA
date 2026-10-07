package com.salud.consultorio.auth.impl;

import com.salud.consultorio.auth.dto.InicioSolicitud;
import com.salud.consultorio.auth.dto.TokenResponse;
import com.salud.consultorio.auth.service.IAuthServicio;
import com.salud.consultorio.auth.service.IJwtServicio;
import com.salud.consultorio.dto.usuario.UsuarioAltaDTO;
import com.salud.consultorio.dto.usuario.UsuarioCreadoDTO;
import com.salud.consultorio.model.entity.*;
import com.salud.consultorio.model.enums.TipoUsuario;
import com.salud.consultorio.repository.IPersonaRepositorio;
import com.salud.consultorio.repository.IRolRepositorio;
import com.salud.consultorio.repository.ITokenRepositorio;
import com.salud.consultorio.repository.IUsuarioRepositorio;
import com.salud.consultorio.service.IUsuarioServicio;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.text.Normalizer;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class IAuthServicioImpl implements IAuthServicio {

    private static final String ROL_PACIENTE = "PACIENTE";
    private static final Set<String> PARTICULAS =
            Set.of("de", "del", "la", "las", "los", "san", "santa", "y");
    private static final int INTENTOS_POR_LONGITUD = 15;
    private static final int LONGITUD_CLAVE = 12;

    private static final String MAYUSCULAS = "ABCDEFGHJKLMNPQRSTUVWXYZ";
    private static final String MINUSCULAS = "abcdefghijkmnpqrstuvwxyz";
    private static final String NUMEROS = "23456789";
    private static final String ESPECIALES = "@#$%&*";
    private static final SecureRandom RANDOM = new SecureRandom();

    private final IUsuarioRepositorio usuarioRepositorio;
    private final ITokenRepositorio tokenRepositorio;
    private final IUsuarioServicio usuarioServicio;
    private final IJwtServicio jwtServicio;
    private final IRolRepositorio rolRepositorio;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final IPersonaRepositorio personaRepositorio;
    private final CorreoServicio correoServicio;

    @Transactional
    @Override
    public UsuarioCreadoDTO crearUsuario(UsuarioAltaDTO dto) {

        Persona persona = personaRepositorio.findById(dto.idPersona())
                .orElseThrow(() -> new EntityNotFoundException("No existe la persona indicada"));

        if (usuarioServicio.existeUsuarioPersona(persona.getId())) {
            throw new DataIntegrityViolationException("La persona ya tiene un usuario registrado");
        }

        String correo = persona.getCorreo();

        if (correo == null || correo.isBlank()) {
            throw new IllegalArgumentException(
                    "La persona no tiene un correo registrado. Actualiza sus datos antes de crear el usuario"
            );
        }

        Rol rol = resolverRol(dto);

        String nombreUsuario = generarNombreUsuario(persona);
        String claveTemporal = generarClaveTemporal();

        Usuario usuario = Usuario.builder()
                .usuario(nombreUsuario)
                .claveAcceso(passwordEncoder.encode(claveTemporal))
                .persona(persona)
                .rol(rol)
                .requiereCambioClave(true)
                .build();

        Usuario guardado = usuarioRepositorio.save(usuario);

        correoServicio.enviarCredencialesUsuario(correo, nombreUsuario, claveTemporal);

        return new UsuarioCreadoDTO(guardado.getId(), nombreUsuario, enmascararCorreo(correo));
    }

    @Transactional
    @Override
    public TokenResponse ingresar(InicioSolicitud request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.usuario(),
                        request.claveAcceso()
                )
        );

        Usuario guardado = usuarioRepositorio.findByUsuario(request.usuario())
                .orElseThrow(() -> new UsernameNotFoundException("No existe el usuario"));

        String jwtToken = jwtServicio.generarToken(guardado);
        String refreshToken = jwtServicio.generarTokenRefrescado(guardado);

        revokeAllUserToken(guardado);
        saveUserToken(guardado, jwtToken);

        return new TokenResponse(jwtToken, refreshToken);
    }

    @Transactional
    @Override
    public TokenResponse refrescarToken(final String authHeder) {

        if (authHeder == null || !authHeder.startsWith("Bearer ")) {
            throw new IllegalArgumentException("Token Bearer Invalido1");
        }

        final String refreshToken = authHeder.substring(7);
        final String user = jwtServicio.extraerUsuario(refreshToken);

        if (user == null) {
            throw new IllegalArgumentException("Token Bearer Invalido2");
        }

        final Usuario usuario = usuarioRepositorio.findByUsuario(user).orElseThrow(
                () -> new UsernameNotFoundException(user)
        );

        List<SimpleGrantedAuthority> authorities = usuario.getRol()
                .getRolPermisos()
                .stream()
                .map(rolPermiso -> new SimpleGrantedAuthority(rolPermiso.getPermiso().getNombre()))
                .toList();

        UserDetails userDetails = new User(usuario.getUsuario(), usuario.getClaveAcceso(), authorities);

        if (!jwtServicio.tokenValido(refreshToken, userDetails)) {
            throw new IllegalArgumentException("Token Bearer Invalido3");
        }

        final String accesoToken = jwtServicio.generarToken(usuario);

        revokeAllUserToken(usuario);
        saveUserToken(usuario, accesoToken);

        return new TokenResponse(accesoToken, refreshToken);
    }

    private Rol resolverRol(UsuarioAltaDTO dto) {

        if (dto.tipo() == TipoUsuario.PACIENTE) {
            return rolRepositorio.findByNombreIgnoreCase(ROL_PACIENTE)
                    .orElseThrow(() -> new EntityNotFoundException("No existe el rol " + ROL_PACIENTE));
        }

        if (dto.idRol() == null) {
            throw new IllegalArgumentException("El rol es obligatorio para los empleados");
        }

        Rol rol = rolRepositorio.findById(dto.idRol())
                .orElseThrow(() -> new EntityNotFoundException("No existe el rol indicado"));

        if (ROL_PACIENTE.equalsIgnoreCase(rol.getNombre())) {
            throw new IllegalArgumentException("El rol " + ROL_PACIENTE + " no se puede asignar a un empleado");
        }

        return rol;
    }

    private String generarNombreUsuario(Persona persona) {

        String base = generarBaseUsuario(persona);

        for (int digitos = 3; digitos <= 4; digitos++) {

            int minimo = (int) Math.pow(10, digitos - 1);
            int rango = 9 * minimo;

            for (int i = 0; i < INTENTOS_POR_LONGITUD; i++) {

                String candidato = base + "_" + (minimo + RANDOM.nextInt(rango));

                if (!usuarioServicio.existeUsuario(candidato)) {
                    return candidato;
                }
            }
        }

        throw new IllegalStateException("No se pudo generar un nombre de usuario disponible");
    }

    private String generarBaseUsuario(Persona persona) {

        String inicial = "";

        for (String palabra : Objects.toString(persona.getNombre(), "").trim().split("\\s+")) {
            String letras = soloLetras(palabra);
            if (!letras.isEmpty()) {
                inicial = letras.substring(0, 1);
                break;
            }
        }

        String base = inicial + primerApellido(persona.getApellidos());

        if (base.isEmpty()) {
            base = "usuario";
        }

        return base.length() > 20 ? base.substring(0, 20) : base;
    }

    private String primerApellido(String apellidos) {

        String respaldo = "";

        for (String palabra : Objects.toString(apellidos, "").trim().split("\\s+")) {

            String letras = soloLetras(palabra);

            if (letras.isEmpty()) {
                continue;
            }

            if (respaldo.isEmpty()) {
                respaldo = letras;
            }

            if (!PARTICULAS.contains(letras)) {
                return letras;
            }
        }

        return respaldo;
    }

    private String soloLetras(String texto) {
        return Normalizer.normalize(Objects.toString(texto, ""), Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z]", "");
    }

    private String generarClaveTemporal() {

        List<Character> caracteres = new ArrayList<>(LONGITUD_CLAVE);

        caracteres.add(aleatorio(MAYUSCULAS));
        caracteres.add(aleatorio(MINUSCULAS));
        caracteres.add(aleatorio(NUMEROS));
        caracteres.add(aleatorio(ESPECIALES));

        String todos = MAYUSCULAS + MINUSCULAS + NUMEROS + ESPECIALES;

        while (caracteres.size() < LONGITUD_CLAVE) {
            caracteres.add(aleatorio(todos));
        }

        Collections.shuffle(caracteres, RANDOM);

        StringBuilder clave = new StringBuilder(LONGITUD_CLAVE);
        caracteres.forEach(clave::append);

        return clave.toString();
    }

    private char aleatorio(String origen) {
        return origen.charAt(RANDOM.nextInt(origen.length()));
    }

    private String enmascararCorreo(String correo) {

        int arroba = correo.indexOf('@');

        if (arroba <= 0) {
            return "***";
        }

        return correo.charAt(0) + "***" + correo.substring(arroba);
    }

    private void saveUserToken(Usuario usuario, String jwtToken) {

        Token token = Token.builder()
                .usuario(usuario)
                .token(jwtToken)
                .tokenType(Token.TokenType.BEARER)
                .expired(false)
                .revoked(false)
                .build();

        tokenRepositorio.save(token);
    }

    private void revokeAllUserToken(final Usuario usuario) {

        final List<Token> validUserTokens = tokenRepositorio
                .findAllByUsuarioIdAndExpiredFalseAndRevokedFalse(usuario.getId());

        if (!validUserTokens.isEmpty()) {
            for (final Token token : validUserTokens) {
                token.setExpired(true);
                token.setRevoked(true);
            }
            tokenRepositorio.saveAll(validUserTokens);
        }
    }

}