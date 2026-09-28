package com.salud.consultorio.auth.service;

import com.salud.consultorio.auth.dto.InicioSolicitud;
import com.salud.consultorio.auth.dto.TokenResponse;
import com.salud.consultorio.auth.exception.AccesoFueraHorarioException;
import com.salud.consultorio.auth.impl.IAuthServicioImpl;
import com.salud.consultorio.model.entity.Doctor;
import com.salud.consultorio.model.entity.Usuario;
import com.salud.consultorio.repository.IDoctorRepositorio;
import com.salud.consultorio.repository.IRecepcionistaRepositorio;
import com.salud.consultorio.repository.ITokenRepositorio;
import com.salud.consultorio.repository.IUsuarioRepositorio;
import com.salud.consultorio.service.IHorarioTrabajoServicio;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class IAuthServicioIngresarTest {

    @Mock
    private IUsuarioRepositorio usuarioRepositorio;

    @Mock
    private ITokenRepositorio tokenRepositorio;

    @Mock
    private IJwtServicio jwtServicio;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private IRecepcionistaRepositorio recepcionistaRepositorio;

    @Mock
    private IDoctorRepositorio doctorRepositorio;

    @Mock
    private IHorarioTrabajoServicio horarioTrabajoServicio;

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
    void ingresar_deberiaIngresarCorrectamente() {

        InicioSolicitud request =
                new InicioSolicitud("juan.perez", "123456");

        when(usuarioRepositorio.findByUsuario("juan.perez"))
                .thenReturn(Optional.of(usuario));

        when(recepcionistaRepositorio.findByUsuario("juan.perez"))
                .thenReturn(Optional.empty());

        when(doctorRepositorio.findByUsuario("juan.perez"))
                .thenReturn(Optional.empty());

        when(jwtServicio.generarToken(usuario))
                .thenReturn("access-token");

        when(jwtServicio.generarTokenRefrescado(usuario))
                .thenReturn("refresh-token");

        TokenResponse resultado =
                authServicio.ingresar(request);

        assertNotNull(resultado);
        assertEquals("access-token", resultado.accessToken());
        assertEquals("refresh-token", resultado.refreshToken());

        verify(authenticationManager)
                .authenticate(any());

        verify(jwtServicio)
                .generarToken(usuario);

        verify(jwtServicio)
                .generarTokenRefrescado(usuario);

        verify(tokenRepositorio)
                .save(any());
    }

    @Test
    void ingresar_deberiaLanzarExcepcion_siCredencialesSonIncorrectas() {

        InicioSolicitud request =
                new InicioSolicitud(
                        "juan.perez",
                        "password-incorrecta"
                );

        when(authenticationManager.authenticate(any()))
                .thenThrow(
                        new BadCredentialsException(
                                "Credenciales inválidas"
                        )
                );

        assertThrows(
                BadCredentialsException.class,
                () -> authServicio.ingresar(request)
        );

        verify(usuarioRepositorio, never())
                .findByUsuario(anyString());

        verify(jwtServicio, never())
                .generarToken(any());
    }

    @Test
    void ingresar_deberiaLanzarExcepcion_siUsuarioNoExiste() {

        InicioSolicitud request =
                new InicioSolicitud("juan.perez", "123456");

        when(usuarioRepositorio.findByUsuario("juan.perez"))
                .thenReturn(Optional.empty());

        assertThrows(
                UsernameNotFoundException.class,
                () -> authServicio.ingresar(request)
        );

        verify(jwtServicio, never())
                .generarToken(any());
    }

    @Test
    void ingresar_deberiaPermitirAcceso_siRecepcionistaEstaEnHorario() {

        usuario.setUsuario("recepcionista");

        InicioSolicitud request =
                new InicioSolicitud(
                        "recepcionista",
                        "123456"
                );

        var recepcionista =
                mock(com.salud.consultorio.model.entity.Recepcionista.class);

        when(recepcionista.getId())
                .thenReturn(10);

        when(usuarioRepositorio.findByUsuario("recepcionista"))
                .thenReturn(Optional.of(usuario));

        when(recepcionistaRepositorio.findByUsuario("recepcionista"))
                .thenReturn(Optional.of(recepcionista));

        when(horarioTrabajoServicio.recepcionistaTrabajaEn(
                anyInt(),
                anyInt(),
                any(LocalTime.class),
                any(LocalTime.class)
        )).thenReturn(true);

        when(doctorRepositorio.findByUsuario("recepcionista"))
                .thenReturn(Optional.empty());

        when(jwtServicio.generarToken(usuario))
                .thenReturn("access-token");

        when(jwtServicio.generarTokenRefrescado(usuario))
                .thenReturn("refresh-token");

        TokenResponse resultado =
                authServicio.ingresar(request);

        assertNotNull(resultado);

        verify(jwtServicio)
                .generarToken(usuario);
    }

    @Test
    void ingresar_deberiaDenegarAcceso_siRecepcionistaEstaFueraDeHorario() {

        InicioSolicitud request =
                new InicioSolicitud(
                        "recepcionista",
                        "123456"
                );

        var recepcionista =
                mock(com.salud.consultorio.model.entity.Recepcionista.class);

        when(recepcionista.getId())
                .thenReturn(10);

        when(usuarioRepositorio.findByUsuario("recepcionista"))
                .thenReturn(Optional.of(usuario));

        when(recepcionistaRepositorio.findByUsuario("recepcionista"))
                .thenReturn(Optional.of(recepcionista));

        when(horarioTrabajoServicio.recepcionistaTrabajaEn(
                anyInt(),
                anyInt(),
                any(LocalTime.class),
                any(LocalTime.class)
        )).thenReturn(false);

        assertThrows(
                AccesoFueraHorarioException.class,
                () -> authServicio.ingresar(request)
        );

        verify(jwtServicio, never())
                .generarToken(any());
    }

    @Test
    void ingresar_deberiaDenegarAcceso_siDoctorEstaFueraDeHorario() {

        InicioSolicitud request =
                new InicioSolicitud("doctor", "123456");

        Doctor doctor = mock(Doctor.class);

        when(doctor.getId())
                .thenReturn(20);

        when(usuarioRepositorio.findByUsuario("doctor"))
                .thenReturn(Optional.of(usuario));

        when(recepcionistaRepositorio.findByUsuario("doctor"))
                .thenReturn(Optional.empty());

        when(doctorRepositorio.findByUsuario("doctor"))
                .thenReturn(Optional.of(doctor));

        when(horarioTrabajoServicio.doctorTrabajaEn(
                anyInt(),
                anyInt(),
                any(LocalTime.class),
                any(LocalTime.class)
        )).thenReturn(false);

        assertThrows(
                AccesoFueraHorarioException.class,
                () -> authServicio.ingresar(request)
        );

        verify(jwtServicio, never())
                .generarToken(any());
    }

}