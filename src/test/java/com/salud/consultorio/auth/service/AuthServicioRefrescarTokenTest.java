package com.salud.consultorio.auth.service;

import com.salud.consultorio.auth.dto.TokenResponse;
import com.salud.consultorio.auth.impl.IAuthServicioImpl;
import com.salud.consultorio.model.entity.Usuario;
import com.salud.consultorio.repository.ITokenRepositorio;
import com.salud.consultorio.repository.IUsuarioRepositorio;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class IAuthServicioRefrescarTokenTest {

    @Mock
    private IUsuarioRepositorio usuarioRepositorio;

    @Mock
    private ITokenRepositorio tokenRepositorio;

    @Mock
    private IJwtServicio jwtServicio;

    @InjectMocks
    private IAuthServicioImpl authServicio;

    private Usuario usuario;

    @BeforeEach
    void setUp() {

        usuario = new Usuario();

        usuario.setId(1);
        usuario.setUsuario("juan.perez");
        usuario.setClaveAcceso("password-encriptado");
    }

    @Test
    void refrescarToken_deberiaLanzarExcepcion_siHeaderEsNull() {

        assertThrows(
                IllegalArgumentException.class,
                () -> authServicio.refrescarToken(null)
        );

        verify(jwtServicio, never())
                .extraerUsuario(anyString());
    }

    @Test
    void refrescarToken_deberiaLanzarExcepcion_siHeaderNoTieneBearer() {

        assertThrows(
                IllegalArgumentException.class,
                () -> authServicio.refrescarToken("Basic abc123")
        );

        verify(jwtServicio, never())
                .extraerUsuario(anyString());
    }

    @Test
    void refrescarToken_deberiaLanzarExcepcion_siNoPuedeExtraerUsuario() {

        when(jwtServicio.extraerUsuario("refresh-token"))
                .thenReturn(null);

        assertThrows(
                IllegalArgumentException.class,
                () -> authServicio.refrescarToken(
                        "Bearer refresh-token"
                )
        );

        verify(usuarioRepositorio, never())
                .findByUsuario(anyString());
    }

    @Test
    void refrescarToken_deberiaLanzarExcepcion_siUsuarioNoExiste() {

        when(jwtServicio.extraerUsuario("refresh-token"))
                .thenReturn("juan.perez");

        when(usuarioRepositorio.findByUsuario("juan.perez"))
                .thenReturn(Optional.empty());

        assertThrows(
                UsernameNotFoundException.class,
                () -> authServicio.refrescarToken(
                        "Bearer refresh-token"
                )
        );

        verify(jwtServicio, never())
                .generarToken(any());
    }

    @Test
    void refrescarToken_deberiaLanzarExcepcion_siTokenNoEsValido() {

        when(jwtServicio.extraerUsuario("refresh-token"))
                .thenReturn("juan.perez");

        when(usuarioRepositorio.findByUsuario("juan.perez"))
                .thenReturn(Optional.of(usuario));

        when(jwtServicio.tokenValido(
                eq("refresh-token"),
                any(UserDetails.class)
        )).thenReturn(false);

        assertThrows(
                IllegalArgumentException.class,
                () -> authServicio.refrescarToken(
                        "Bearer refresh-token"
                )
        );

        verify(jwtServicio, never())
                .generarToken(any());
    }

    @Test
    void refrescarToken_deberiaGenerarNuevoAccessToken() {

        when(jwtServicio.extraerUsuario("refresh-token"))
                .thenReturn("juan.perez");

        when(usuarioRepositorio.findByUsuario("juan.perez"))
                .thenReturn(Optional.of(usuario));

        when(jwtServicio.tokenValido(
                eq("refresh-token"),
                any(UserDetails.class)
        )).thenReturn(true);

        when(jwtServicio.generarToken(usuario))
                .thenReturn("nuevo-access-token");

        TokenResponse resultado =
                authServicio.refrescarToken(
                        "Bearer refresh-token"
                );

        assertNotNull(resultado);

        assertEquals(
                "nuevo-access-token",
                resultado.accessToken()
        );

        assertEquals(
                "refresh-token",
                resultado.refreshToken()
        );

        verify(jwtServicio)
                .extraerUsuario("refresh-token");

        verify(jwtServicio)
                .tokenValido(
                        eq("refresh-token"),
                        any(UserDetails.class)
                );

        verify(jwtServicio)
                .generarToken(usuario);

        verify(tokenRepositorio)
                .save(any());
    }
}