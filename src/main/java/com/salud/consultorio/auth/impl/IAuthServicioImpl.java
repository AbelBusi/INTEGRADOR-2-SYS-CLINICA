package com.salud.consultorio.auth.impl;

import com.salud.consultorio.auth.dto.InicioSolicitud;
import com.salud.consultorio.auth.dto.TokenResponse;
import com.salud.consultorio.auth.dto.UsuarioCrearDTO;
import com.salud.consultorio.auth.service.IAuthServicio;
import com.salud.consultorio.auth.service.IJwtServicio;
import com.salud.consultorio.model.entity.*;
import com.salud.consultorio.model.mapper.IRolMapper;
import com.salud.consultorio.model.mapper.IUsuarioMapper;
import com.salud.consultorio.repository.IPersonaRepositorio;
import com.salud.consultorio.repository.ITokenRepositorio;
import com.salud.consultorio.repository.IUsuarioRepositorio;
import com.salud.consultorio.service.IRolServicio;
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
import java.util.List;

@Service
@RequiredArgsConstructor
public class IAuthServicioImpl implements IAuthServicio {

    private final IUsuarioRepositorio usuarioRepositorio;
    private final ITokenRepositorio tokenRepositorio;
    private final IUsuarioServicio usuarioServicio;
    private final IJwtServicio jwtServicio;
    private final IRolServicio rolServicio;
    private final IUsuarioMapper usuarioMapper;
    private final IRolMapper rolMapper;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final IPersonaRepositorio personaRepositorio;
    private final CorreoServicio correoServicio;

    @Transactional
    @Override
    public TokenResponse registrar(UsuarioCrearDTO dto) {

        if (!rolServicio.existeRolId(dto.getRol().getId())) {
            throw new EntityNotFoundException(
                    "No existe el rol indicado"
            );
        }

        if (usuarioServicio.existeUsuario(dto.getUsuario())) {
            throw new DataIntegrityViolationException(
                    "No se puede guardar al usuario"
            );
        }

        if (usuarioServicio.existeUsuarioPersona(dto.getPersona().getId())) {
            throw new DataIntegrityViolationException(
                    "La persona ya tiene un usuario registrado"
            );
        }

        Persona persona = personaRepositorio.findById(
                dto.getPersona().getId()
        ).orElseThrow(() ->
                new EntityNotFoundException(
                        "No existe la persona indicada"
                )
        );

        String claveTemporal = generarClaveTemporal();

        Rol rol = rolMapper.rolRefDtoToRol(dto.getRol());

        Usuario usuario = usuarioMapper.toEntity(dto);

        usuario.setClaveAcceso(
                passwordEncoder.encode(claveTemporal)
        );

        usuario.setPersona(persona);
        usuario.setRol(rol);
        usuario.setRequiereCambioClave(true);

        Usuario guardado = usuarioRepositorio.save(usuario);

        String jwtToken = jwtServicio.generarToken(guardado);
        String refreshToken = jwtServicio.generarTokenRefrescado(guardado);

        saveUserToken(guardado, jwtToken);

        return new TokenResponse(jwtToken, refreshToken);
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

        if (authHeder == null || !authHeder.startsWith("Bearer ")){
            throw new IllegalArgumentException("Token Bearer Invalido1");
        }

        final String refreshToken = authHeder.substring(7);
        final String user = jwtServicio.extraerUsuario(refreshToken);

        if (user == null){
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

        if (!jwtServicio.tokenValido(refreshToken, userDetails)){
            throw new IllegalArgumentException("Token Bearer Invalido3");
        }

        final String accesoToken = jwtServicio.generarToken(usuario);

        revokeAllUserToken(usuario);
        saveUserToken(usuario, accesoToken);

        return new TokenResponse(accesoToken, refreshToken);
    }

    private void saveUserToken(Usuario usuario, String jwtToken){

        Token token = Token.builder()
                .usuario(usuario)
                .token(jwtToken)
                .tokenType(Token.TokenType.BEARER)
                .expired(false)
                .revoked(false)
                .build();

        tokenRepositorio.save(token);
    }

    private void revokeAllUserToken(final Usuario usuario){
        final List<Token> validUserTokens = tokenRepositorio
                .findAllByUsuarioIdAndExpiredFalseAndRevokedFalse(usuario.getId());

        if (!validUserTokens.isEmpty()){
            for (final Token token : validUserTokens){
                token.setExpired(true);
                token.setRevoked(true);
            }
            tokenRepositorio.saveAll(validUserTokens);
        }
    }

    private static final String CARACTERES =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
                    "abcdefghijklmnopqrstuvwxyz" +
                    "0123456789" +
                    "@#$%&*";

    private static final SecureRandom RANDOM = new SecureRandom();

    private String generarClaveTemporal() {

        int longitud = 12;

        StringBuilder clave = new StringBuilder(longitud);

        for (int i = 0; i < longitud; i++) {
            clave.append(CARACTERES.charAt(
                    RANDOM.nextInt(CARACTERES.length())
            ));
        }

        return clave.toString();
    }

}