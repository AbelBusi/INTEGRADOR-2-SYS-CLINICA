package com.salud.consultorio.auth.impl;

import com.salud.consultorio.auth.dto.CambiarClaveRequest;
import com.salud.consultorio.auth.dto.EstadoCuentaResponse;
import com.salud.consultorio.auth.dto.InicioSolicitud;
import com.salud.consultorio.auth.dto.LoginResponse;
import com.salud.consultorio.auth.dto.PerfilDTO;
import com.salud.consultorio.auth.dto.SeleccionarRolRequest;
import com.salud.consultorio.auth.dto.TokenResponse;
import com.salud.consultorio.auth.exception.UsuarioInactivoException;
import com.salud.consultorio.auth.service.IAuthServicio;
import com.salud.consultorio.auth.service.IJwtServicio;
import com.salud.consultorio.dto.usuario.UsuarioAltaDTO;
import com.salud.consultorio.dto.usuario.UsuarioCreadoDTO;
import com.salud.consultorio.model.entity.*;
import com.salud.consultorio.model.enums.TipoUsuario;
import com.salud.consultorio.repository.*;
import com.salud.consultorio.service.IUsuarioRolReglasServicio;
import com.salud.consultorio.service.IUsuarioServicio;
import io.jsonwebtoken.JwtException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
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
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class IAuthServicioImpl implements IAuthServicio {

    private static final String ROL_PACIENTE = "PACIENTE";
    private static final String MENSAJE_INACTIVO =
            "Tu cuenta está desactivada. Comunícate con el administrador del sistema.";
    private static final String MENSAJE_SELECCION_EXPIRADA =
            "La selección de perfil expiró. Inicia sesión nuevamente.";
    private static final String MENSAJE_PERFIL_NO_DISPONIBLE =
            "El perfil seleccionado no está disponible para tu cuenta";
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
    private final IUsuarioRolRepositorio usuarioRolRepositorio;
    private final IUsuarioRolReglasServicio usuarioRolReglasServicio;

    @Transactional
    @Override
    public UsuarioCreadoDTO crearUsuario(UsuarioAltaDTO dto) {

        Persona persona = personaRepositorio.findById(dto.idPersona())
                .orElseThrow(() -> new EntityNotFoundException("No existe la persona indicada"));

        if (usuarioServicio.existeUsuarioPersona(persona.getId())) {
            throw new DataIntegrityViolationException(
                    "La persona ya tiene una cuenta de usuario. Para darle otro rol, gestiona los roles de su cuenta existente"
            );
        }

        String correo = persona.getCorreo();

        if (correo == null || correo.isBlank()) {
            throw new IllegalArgumentException(
                    "La persona no tiene un correo registrado. Actualiza sus datos antes de crear el usuario"
            );
        }

        List<Rol> roles = resolverRoles(dto);

        roles.forEach(rol -> usuarioRolReglasServicio.validarRolAsignable(persona.getId(), rol));

        String nombreUsuario = generarNombreUsuario(persona);
        String claveTemporal = generarClaveTemporal();

        Usuario usuario = Usuario.builder()
                .usuario(nombreUsuario)
                .claveAcceso(passwordEncoder.encode(claveTemporal))
                .persona(persona)
                .requiereCambioClave(true)
                .build();

        Usuario guardado = usuarioRepositorio.save(usuario);

        List<UsuarioRol> asignaciones = roles.stream()
                .map(rol -> UsuarioRol.builder()
                        .usuario(guardado)
                        .rol(rol)
                        .build())
                .toList();

        usuarioRolRepositorio.saveAll(asignaciones);

        correoServicio.enviarCredencialesUsuario(correo, nombreUsuario, claveTemporal);

        return new UsuarioCreadoDTO(guardado.getId(), nombreUsuario, enmascararCorreo(correo));
    }
    @Transactional
    @Override
    public LoginResponse ingresar(InicioSolicitud request) {

        Usuario existente = usuarioRepositorio.findByUsuario(request.usuario()).orElse(null);

        if (existente != null
                && !esActivo(existente)
                && passwordEncoder.matches(request.claveAcceso(), existente.getClaveAcceso())) {
            throw new UsuarioInactivoException(MENSAJE_INACTIVO);
        }

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.usuario(),
                            request.claveAcceso()
                    )
            );
        } catch (DisabledException | LockedException e) {
            throw new BadCredentialsException("Credenciales inválidas");
        }

        if (existente == null) {
            throw new UsernameNotFoundException("No existe el usuario");
        }

        List<Rol> perfiles = rolesVigentes(existente.getUsuario());

        if (perfiles.isEmpty()) {
            throw new BadCredentialsException("Credenciales inválidas");
        }

        if (perfiles.size() == 1 || requiereCambio(existente)) {
            return LoginResponse.conSesion(emitirSesion(existente, perfiles.get(0)));
        }

        return LoginResponse.conSeleccion(
                jwtServicio.generarTokenSeleccion(existente),
                perfiles.stream().map(this::aPerfil).toList()
        );
    }

    @Transactional
    @Override
    public TokenResponse seleccionarRol(SeleccionarRolRequest request) {

        String nombreUsuario;

        try {
            if (!IJwtServicio.TIPO_SELECCION.equals(jwtServicio.extraerTipo(request.tokenSeleccion()))) {
                throw new BadCredentialsException(MENSAJE_SELECCION_EXPIRADA);
            }
            nombreUsuario = jwtServicio.extraerUsuario(request.tokenSeleccion());
        } catch (JwtException e) {
            throw new BadCredentialsException(MENSAJE_SELECCION_EXPIRADA);
        }

        Usuario usuario = usuarioRepositorio.findByUsuario(nombreUsuario)
                .orElseThrow(() -> new BadCredentialsException(MENSAJE_SELECCION_EXPIRADA));

        if (!esActivo(usuario)) {
            throw new UsuarioInactivoException(MENSAJE_INACTIVO);
        }

        Rol rol = resolverRolVigente(usuario, request.idRol());

        return emitirSesion(usuario, rol);
    }

    @Transactional
    @Override
    public TokenResponse cambiarPerfil(String nombreUsuario, Integer idRol) {

        Usuario usuario = usuarioRepositorio.findByUsuario(nombreUsuario)
                .orElseThrow(() -> new UsernameNotFoundException("No existe el usuario"));

        if (!esActivo(usuario)) {
            throw new UsuarioInactivoException(MENSAJE_INACTIVO);
        }

        Rol rol = resolverRolVigente(usuario, idRol);

        return emitirSesion(usuario, rol);
    }

    @Transactional(readOnly = true)
    @Override
    public List<PerfilDTO> misPerfiles(String nombreUsuario) {
        return rolesVigentes(nombreUsuario).stream().map(this::aPerfil).toList();
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

        if (!IJwtServicio.TIPO_REFRESH.equals(jwtServicio.extraerTipo(refreshToken))) {
            throw new IllegalArgumentException("Token Bearer Invalido");
        }

        final Integer idRol = jwtServicio.extraerIdRol(refreshToken);

        if (idRol == null) {
            throw new IllegalArgumentException("Token Bearer Invalido");
        }

        final Usuario usuario = usuarioRepositorio.findByUsuario(user).orElseThrow(
                () -> new UsernameNotFoundException(user)
        );

        if (!esActivo(usuario)) {
            throw new UsuarioInactivoException(MENSAJE_INACTIVO);
        }

        final Rol rol = resolverRolVigente(usuario, idRol);

        UserDetails userDetails = new User(
                usuario.getUsuario(),
                usuario.getClaveAcceso(),
                permisosDe(rol)
        );

        if (!jwtServicio.tokenValido(refreshToken, userDetails)) {
            throw new IllegalArgumentException("Token Bearer Invalido");
        }

        final String accesoToken = jwtServicio.generarToken(usuario, rol);

        revokeAllUserToken(usuario);
        saveUserToken(usuario, accesoToken);

        return new TokenResponse(accesoToken, refreshToken, requiereCambio(usuario));
    }


    @Transactional
    @Override
    public void cambiarClave(String nombreUsuario, CambiarClaveRequest dto) {

        Usuario usuario = usuarioRepositorio.findByUsuario(nombreUsuario)
                .orElseThrow(() -> new UsernameNotFoundException("No existe el usuario"));

        if (!esActivo(usuario)) {
            throw new UsuarioInactivoException(MENSAJE_INACTIVO);
        }

        if (passwordEncoder.matches(dto.nuevaClave(), usuario.getClaveAcceso())) {
            throw new IllegalArgumentException(
                    "La nueva contraseña debe ser distinta a la actual");
        }

        usuario.setClaveAcceso(passwordEncoder.encode(dto.nuevaClave()));
        usuario.setRequiereCambioClave(false);

        usuarioRepositorio.save(usuario);

        revokeAllUserToken(usuario);
    }

    @Transactional(readOnly = true)
    @Override
    public EstadoCuentaResponse estadoCuenta(String nombreUsuario) {

        Usuario usuario = usuarioRepositorio.findByUsuario(nombreUsuario)
                .orElseThrow(() -> new UsernameNotFoundException("No existe el usuario"));

        return new EstadoCuentaResponse(usuario.isRequiereCambioClave());
    }

    @Transactional(readOnly = true)
    @Override
    public void validarNoEsCuentaPropia(Integer idUsuario, String usuarioActual, String mensaje) {

        boolean cuentaPropia = usuarioRepositorio.findByUsuario(usuarioActual)
                .map(actual -> actual.getId().equals(idUsuario))
                .orElse(false);

        if (cuentaPropia) {
            throw new IllegalArgumentException(mensaje);
        }
    }

    @Transactional
    @Override
    public void revocarSesionesUsuario(Integer idUsuario) {

        Usuario usuario = usuarioRepositorio.findById(idUsuario)
                .orElseThrow(() -> new EntityNotFoundException("No existe el usuario indicado"));

        revokeAllUserToken(usuario);
    }

    private boolean esActivo(Usuario usuario) {
        return Integer.valueOf(1).equals(usuario.getEstado());
    }

    private boolean requiereCambio(Usuario usuario) {
        return usuario.isRequiereCambioClave();
    }

    /** Roles vigentes del usuario (asignación activa + rol activo), ordenados por id. */
    private List<Rol> rolesVigentes(String nombreUsuario) {

        return usuarioRolRepositorio
                .findAllByUsuario_UsuarioAndEstadoAndRol_Estado(nombreUsuario, 1, 1)
                .stream()
                .map(UsuarioRol::getRol)
                .sorted(Comparator.comparing(Rol::getId))
                .toList();
    }

    /** El rol pedido debe estar entre los vigentes del propio usuario. */
    private Rol resolverRolVigente(Usuario usuario, Integer idRol) {

        return rolesVigentes(usuario.getUsuario()).stream()
                .filter(rol -> rol.getId().equals(idRol))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException(MENSAJE_PERFIL_NO_DISPONIBLE));
    }

    private PerfilDTO aPerfil(Rol rol) {
        return new PerfilDTO(rol.getId(), rol.getNombre(), rol.getDescripcion());
    }

    private List<SimpleGrantedAuthority> permisosDe(Rol rol) {

        return rol.getRolPermisos().stream()
                .map(rp -> new SimpleGrantedAuthority(rp.getPermiso().getCodigo()))
                .distinct()
                .toList();
    }

    /** Abre una sesión limitada al rol indicado y cierra la anterior. */
    private TokenResponse emitirSesion(Usuario usuario, Rol rol) {

        String jwtToken = jwtServicio.generarToken(usuario, rol);
        String refreshToken = jwtServicio.generarTokenRefrescado(usuario, rol);

        revokeAllUserToken(usuario);
        saveUserToken(usuario, jwtToken);

        return new TokenResponse(jwtToken, refreshToken, requiereCambio(usuario));
    }

    private List<Rol> resolverRoles(UsuarioAltaDTO dto) {

        if (dto.tipo() == TipoUsuario.PACIENTE) {
            Rol rolPaciente = rolRepositorio.findByNombreIgnoreCase(ROL_PACIENTE)
                    .filter(rol -> Integer.valueOf(1).equals(rol.getEstado()))
                    .orElseThrow(() ->
                            new EntityNotFoundException(
                                    "El rol PACIENTE no existe o no está activo"
                            )
                    );
            return List.of(rolPaciente);
        }

        if (dto.idRoles() == null || dto.idRoles().isEmpty()) {
            throw new IllegalArgumentException(
                    "Debes indicar al menos un rol para los empleados"
            );
        }

        return dto.idRoles().stream()
                .distinct()
                .map(this::validarRolAsignableAEmpleado)
                .toList();
    }

    private Rol validarRolAsignableAEmpleado(Integer idRol) {

        Rol rol = rolRepositorio.findById(idRol)
                .orElseThrow(() ->
                        new EntityNotFoundException("No existe el rol indicado: " + idRol)
                );

        if (!Integer.valueOf(1).equals(rol.getEstado())) {
            throw new IllegalArgumentException(
                    "El rol " + rol.getNombre() + " no está activo"
            );
        }

        if (ROL_PACIENTE.equalsIgnoreCase(rol.getNombre())) {
            throw new IllegalArgumentException(
                    "El rol PACIENTE no se puede asignar a un empleado"
            );
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