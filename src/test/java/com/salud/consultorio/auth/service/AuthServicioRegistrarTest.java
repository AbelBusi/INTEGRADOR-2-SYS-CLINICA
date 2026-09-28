package com.salud.consultorio.auth.service;

import com.salud.consultorio.auth.dto.TokenResponse;
import com.salud.consultorio.auth.dto.UsuarioCrearDTO;
import com.salud.consultorio.auth.impl.IAuthServicioImpl;
import com.salud.consultorio.model.entity.Persona;
import com.salud.consultorio.model.entity.Rol;
import com.salud.consultorio.model.entity.Token;
import com.salud.consultorio.model.entity.Usuario;
import com.salud.consultorio.model.mapper.IPersonaMapper;
import com.salud.consultorio.model.mapper.IRolMapper;
import com.salud.consultorio.model.mapper.IUsuarioMapper;
import com.salud.consultorio.repository.ITokenRepositorio;
import com.salud.consultorio.repository.IUsuarioRepositorio;
import com.salud.consultorio.service.IRolServicio;
import com.salud.consultorio.service.IUsuarioServicio;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class IAuthServicioRegistrarTest {

    @Mock
    private IUsuarioRepositorio usuarioRepositorio;

    @Mock
    private ITokenRepositorio tokenRepositorio;

    @Mock
    private IUsuarioServicio usuarioServicio;

    @Mock
    private IJwtServicio jwtServicio;

    @Mock
    private IRolServicio rolServicio;

    @Mock
    private IUsuarioMapper usuarioMapper;

    @Mock
    private IPersonaMapper personaMapper;

    @Mock
    private IRolMapper rolMapper;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private IAuthServicioImpl authServicio;

    private Usuario usuario;
    private Persona persona;
    private Rol rol;
    private UsuarioCrearDTO dto;

    @BeforeEach
    void setUp() {
        persona = new Persona();
        rol = new Rol();

        usuario = new Usuario();
        usuario.setId(1);
        usuario.setUsuario("juan.perez");
        usuario.setClaveAcceso("password-encriptado");
        usuario.setRol(rol);

        dto = new UsuarioCrearDTO();
    }

    @Test
    void registrar_deberiaRegistrarCorrectamente() {

        when(rolServicio.existeRolId(anyInt()))
                .thenReturn(true);

        when(usuarioServicio.existeUsuario(anyString()))
                .thenReturn(false);

        when(usuarioServicio.existeUsuarioPersona(anyInt()))
                .thenReturn(false);

        when(usuarioMapper.toEntity(dto))
                .thenReturn(usuario);

        when(personaMapper.personaRefDtoToPersona(any()))
                .thenReturn(persona);

        when(rolMapper.rolRefDtoToRol(any()))
                .thenReturn(rol);

        when(passwordEncoder.encode(anyString()))
                .thenReturn("password-encriptado");

        when(usuarioRepositorio.save(usuario))
                .thenReturn(usuario);

        when(jwtServicio.generarToken(usuario))
                .thenReturn("access-token");

        when(jwtServicio.generarTokenRefrescado(usuario))
                .thenReturn("refresh-token");

        TokenResponse resultado = authServicio.registrar(dto);

        assertNotNull(resultado);
        assertEquals("access-token", resultado.accessToken());
        assertEquals("refresh-token", resultado.refreshToken());

        verify(usuarioRepositorio).save(usuario);
        verify(passwordEncoder).encode(anyString());
        verify(jwtServicio).generarToken(usuario);
        verify(jwtServicio).generarTokenRefrescado(usuario);
        verify(tokenRepositorio).save(any(Token.class));
    }

    @Test
    void registrar_deberiaLanzarExcepcion_siRolNoExiste() {

        when(rolServicio.existeRolId(anyInt()))
                .thenReturn(false);

        assertThrows(
                EntityNotFoundException.class,
                () -> authServicio.registrar(dto)
        );

        verify(usuarioRepositorio, never()).save(any());
        verify(usuarioServicio, never()).existeUsuario(anyString());
        verify(jwtServicio, never()).generarToken(any());
    }

    @Test
    void registrar_deberiaLanzarExcepcion_siUsuarioYaExiste() {

        when(rolServicio.existeRolId(anyInt()))
                .thenReturn(true);

        when(usuarioServicio.existeUsuario(anyString()))
                .thenReturn(true);

        assertThrows(
                DataIntegrityViolationException.class,
                () -> authServicio.registrar(dto)
        );

        verify(usuarioRepositorio, never()).save(any());
        verify(jwtServicio, never()).generarToken(any());
    }

    @Test
    void registrar_deberiaLanzarExcepcion_siPersonaYaTieneUsuario() {

        when(rolServicio.existeRolId(anyInt()))
                .thenReturn(true);

        when(usuarioServicio.existeUsuario(anyString()))
                .thenReturn(false);

        when(usuarioServicio.existeUsuarioPersona(anyInt()))
                .thenReturn(true);

        assertThrows(
                DataIntegrityViolationException.class,
                () -> authServicio.registrar(dto)
        );

        verify(usuarioRepositorio, never()).save(any());
        verify(jwtServicio, never()).generarToken(any());
    }
}