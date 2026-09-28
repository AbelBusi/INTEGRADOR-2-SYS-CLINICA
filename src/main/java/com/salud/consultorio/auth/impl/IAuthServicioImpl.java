package com.salud.consultorio.auth.impl;

import com.salud.consultorio.auth.dto.InicioSolicitud;
import com.salud.consultorio.auth.dto.TokenResponse;
import com.salud.consultorio.auth.dto.UsuarioCrearDTO;
import com.salud.consultorio.auth.service.IAuthServicio;
import com.salud.consultorio.auth.service.IJwtServicio;
import com.salud.consultorio.model.entity.Persona;
import com.salud.consultorio.model.entity.Rol;
import com.salud.consultorio.model.entity.Token;
import com.salud.consultorio.model.entity.Usuario;
import com.salud.consultorio.model.mapper.IPersonaMapper;
import com.salud.consultorio.model.mapper.IRolMapper;
import com.salud.consultorio.model.mapper.IUsuarioMapper;
import com.salud.consultorio.auth.exception.AccesoFueraHorarioException;
import com.salud.consultorio.repository.IDoctorRepositorio;
import com.salud.consultorio.repository.IRecepcionistaRepositorio;
import com.salud.consultorio.repository.ITokenRepositorio;
import com.salud.consultorio.repository.IUsuarioRepositorio;
import com.salud.consultorio.service.IHorarioTrabajoServicio;
import com.salud.consultorio.service.IRolServicio;
import com.salud.consultorio.service.IUsuarioServicio;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;

import java.time.LocalDate;
import java.time.LocalTime;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    private final IPersonaMapper personaMapper;
    private final IRolMapper rolMapper;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final IRecepcionistaRepositorio recepcionistaRepositorio;
    private final IDoctorRepositorio doctorRepositorio;
    private final IHorarioTrabajoServicio horarioTrabajoServicio;

    @Transactional
    @Override
    public TokenResponse registrar(UsuarioCrearDTO dto) {

        if (!rolServicio.existeRolId(dto.getRol().getId())){
            throw new EntityNotFoundException("No existe el rol en la entidad");
        }

        if (usuarioServicio.existeUsuario(dto.getUsuario())){
            throw new DataIntegrityViolationException("No se puede guardar al usuario");
        }

        if (usuarioServicio.existeUsuarioPersona(dto.getPersona().getId())){
            throw new DataIntegrityViolationException("El usurio ya se encuentra anteriormente en el sistema");
        }

        Usuario usuario = usuarioMapper.toEntity(dto);

        Persona persona = personaMapper.personaRefDtoToPersona(dto.getPersona());

        Rol rol = rolMapper.rolRefDtoToRol(dto.getRol());

        usuario.setClaveAcceso(passwordEncoder.encode(dto.getClaveAcceso()));
        usuario.setPersona(persona);
        usuario.setRol(rol);

        Usuario guardado = usuarioRepositorio.save(usuario);
        String jwtToken = jwtServicio.generarToken(usuario);
        String refreshToken = jwtServicio.generarTokenRefrescado(usuario);

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

        recepcionistaRepositorio.findByUsuario(guardado.getUsuario()).ifPresent(recepcionista -> {
            LocalDate hoy = LocalDate.now();
            LocalTime ahora = LocalTime.now();
            if (!horarioTrabajoServicio.recepcionistaTrabajaEn(recepcionista.getId(), hoy.getDayOfWeek().getValue(), ahora, ahora)) {
                throw new AccesoFueraHorarioException("Acceso denegado: te encuentras fuera de tu horario de trabajo.");
            }
        });

        doctorRepositorio.findByUsuario(guardado.getUsuario()).ifPresent(doctor -> {
            LocalDate hoy = LocalDate.now();
            LocalTime ahora = LocalTime.now();
            if (!horarioTrabajoServicio.doctorTrabajaEn(doctor.getId(), hoy.getDayOfWeek().getValue(), ahora, ahora)) {
                throw new AccesoFueraHorarioException("Acceso denegado: te encuentras fuera de tu horario de trabajo.");
            }
        });

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
}