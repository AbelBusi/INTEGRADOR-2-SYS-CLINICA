package com.salud.consultorio.service;

import com.salud.consultorio.dto.especialidad.*;
import com.salud.consultorio.impl.EspecialidadServicioImpl;
import com.salud.consultorio.model.entity.Especialidad;
import com.salud.consultorio.model.mapper.IEspecialidadMapper;
import com.salud.consultorio.repository.IEspecialidadRepositorio;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataIntegrityViolationException;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EspecialidadServicioImplTest {

    @Mock
    private IEspecialidadRepositorio especialidadRepositorio;

    @Mock
    private IEspecialidadMapper especialidadMapper;

    @InjectMocks
    private EspecialidadServicioImpl especialidadServicio;

    private Especialidad especialidad;
    private EspecialidadCrearDTO crearDTO;
    private EspecialidadActualizarDTO actualizarDTO;
    private EspecialidadRespuestaDTO respuestaDTO;
    private EspecialidadLeerDTO leerDTO;

    @BeforeEach
    void setUp() {

        especialidad = new Especialidad();
        especialidad.setId(1);
        especialidad.setNombre("Cardiología");

        crearDTO = new EspecialidadCrearDTO();
        crearDTO.setNombre("Cardiología");

        actualizarDTO = new EspecialidadActualizarDTO();
        actualizarDTO.setNombre("Neurología");

        respuestaDTO = mock(EspecialidadRespuestaDTO.class);
        leerDTO = mock(EspecialidadLeerDTO.class);
    }

    @Test
    void listarTodos_deberiaRetornarTodasLasEspecialidades() {

        List<EspecialidadLeerDTO> especialidades = List.of(leerDTO);

        when(especialidadRepositorio.leerEspecialidades())
                .thenReturn(especialidades);

        List<EspecialidadLeerDTO> resultado =
                especialidadServicio.listarTodos();

        assertNotNull(resultado);
        assertEquals(1, resultado.size());
        assertEquals(especialidades, resultado);

        verify(especialidadRepositorio).leerEspecialidades();
    }

    @Test
    void listarActivos_deberiaRetornarEspecialidadesActivas() {

        List<EspecialidadLeerDTO> especialidades = List.of(leerDTO);

        when(especialidadRepositorio.leerEspecialidadesActivas())
                .thenReturn(especialidades);

        List<EspecialidadLeerDTO> resultado =
                especialidadServicio.listarActivos();

        assertNotNull(resultado);
        assertEquals(especialidades, resultado);

        verify(especialidadRepositorio).leerEspecialidadesActivas();
    }

    @Test
    void listarInactivo_deberiaRetornarEspecialidadesInactivas() {

        List<EspecialidadLeerDTO> especialidades = List.of(leerDTO);

        when(especialidadRepositorio.leerEspecialidadesInactivas())
                .thenReturn(especialidades);

        List<EspecialidadLeerDTO> resultado =
                especialidadServicio.listarInactivo();

        assertNotNull(resultado);
        assertEquals(especialidades, resultado);

        verify(especialidadRepositorio).leerEspecialidadesInactivas();
    }

    @Test
    void leerPorId_deberiaRetornarEspecialidadCuandoExiste() {

        when(especialidadRepositorio.leerEspecialidadPorId(1))
                .thenReturn(Optional.of(leerDTO));

        EspecialidadLeerDTO resultado =
                especialidadServicio.leerPorId(1);

        assertNotNull(resultado);
        assertEquals(leerDTO, resultado);

        verify(especialidadRepositorio).leerEspecialidadPorId(1);
    }

    @Test
    void leerPorId_deberiaLanzarExcepcionCuandoNoExiste() {

        when(especialidadRepositorio.leerEspecialidadPorId(1))
                .thenReturn(Optional.empty());

        assertThrows(
                EntityNotFoundException.class,
                () -> especialidadServicio.leerPorId(1)
        );

        verify(especialidadRepositorio).leerEspecialidadPorId(1);
    }

    @Test
    void obtenerPorId_deberiaRetornarEspecialidadCuandoExiste() {

        when(especialidadRepositorio.findById(1))
                .thenReturn(Optional.of(especialidad));

        Optional<Especialidad> resultado =
                especialidadServicio.obtenerPorId(1);

        assertTrue(resultado.isPresent());
        assertEquals(especialidad, resultado.get());

        verify(especialidadRepositorio).findById(1);
    }

    @Test
    void obtenerPorId_deberiaRetornarVacioCuandoNoExiste() {

        when(especialidadRepositorio.findById(1))
                .thenReturn(Optional.empty());

        Optional<Especialidad> resultado =
                especialidadServicio.obtenerPorId(1);

        assertTrue(resultado.isEmpty());

        verify(especialidadRepositorio).findById(1);
    }

    @Test
    void crear_deberiaCrearEspecialidadCorrectamente() {

        when(especialidadRepositorio.existsByNombre("Cardiología"))
                .thenReturn(false);

        when(especialidadMapper.especialidadDtoToEspecialidad(crearDTO))
                .thenReturn(especialidad);

        when(especialidadRepositorio.save(especialidad))
                .thenReturn(especialidad);

        when(especialidadMapper.toDto(especialidad))
                .thenReturn(respuestaDTO);

        EspecialidadRespuestaDTO resultado =
                especialidadServicio.crear(crearDTO);

        assertNotNull(resultado);
        assertEquals(respuestaDTO, resultado);

        verify(especialidadRepositorio)
                .existsByNombre("Cardiología");

        verify(especialidadMapper)
                .especialidadDtoToEspecialidad(crearDTO);

        verify(especialidadRepositorio)
                .save(especialidad);

        verify(especialidadMapper)
                .toDto(especialidad);
    }

    @Test
    void crear_deberiaLanzarExcepcionCuandoNombreYaExiste() {

        when(especialidadRepositorio.existsByNombre("Cardiología"))
                .thenReturn(true);

        assertThrows(
                DataIntegrityViolationException.class,
                () -> especialidadServicio.crear(crearDTO)
        );

        verify(especialidadRepositorio)
                .existsByNombre("Cardiología");

        verify(especialidadRepositorio, never())
                .save(any(Especialidad.class));

        verify(especialidadMapper, never())
                .especialidadDtoToEspecialidad(any());

        verify(especialidadMapper, never())
                .toDto(any());
    }

    @Test
    void actualizar_deberiaActualizarEspecialidadCorrectamente() {

        when(especialidadRepositorio.findById(1))
                .thenReturn(Optional.of(especialidad));

        when(especialidadMapper.toDto(especialidad))
                .thenReturn(respuestaDTO);

        EspecialidadRespuestaDTO resultado =
                especialidadServicio.actualizar(actualizarDTO, 1);

        assertNotNull(resultado);
        assertEquals(respuestaDTO, resultado);

        verify(especialidadRepositorio).findById(1);

        verify(especialidadMapper)
                .updateFromDto(actualizarDTO, especialidad);

        verify(especialidadMapper)
                .toDto(especialidad);
    }

    @Test
    void actualizar_deberiaLanzarExcepcionCuandoNoExiste() {

        when(especialidadRepositorio.findById(1))
                .thenReturn(Optional.empty());

        assertThrows(
                EntityNotFoundException.class,
                () -> especialidadServicio.actualizar(actualizarDTO, 1)
        );

        verify(especialidadRepositorio).findById(1);

        verify(especialidadMapper, never())
                .updateFromDto(any(), any());

        verify(especialidadMapper, never())
                .toDto(any());
    }

    @Test
    void eliminarPorId_deberiaCambiarEstadoCuandoExiste() {

        when(especialidadRepositorio.existsById(1))
                .thenReturn(true);

        especialidadServicio.eliminarPorId(1);

        verify(especialidadRepositorio)
                .existsById(1);

        verify(especialidadRepositorio)
                .EspecialidadCambiarEstado(0, 1);
    }

    @Test
    void eliminarPorId_deberiaLanzarExcepcionCuandoNoExiste() {

        when(especialidadRepositorio.existsById(1))
                .thenReturn(false);

        assertThrows(
                RuntimeException.class,
                () -> especialidadServicio.eliminarPorId(1)
        );

        verify(especialidadRepositorio)
                .existsById(1);

        verify(especialidadRepositorio, never())
                .EspecialidadCambiarEstado(anyInt(), anyInt());
    }

    @Test
    void existeEspecialidad_deberiaRetornarTrueCuandoExiste() {

        when(especialidadRepositorio.existsById(1))
                .thenReturn(true);

        boolean resultado =
                especialidadServicio.existeEspecialidad(1);

        assertTrue(resultado);

        verify(especialidadRepositorio).existsById(1);
    }

    @Test
    void existeEspecialidad_deberiaRetornarFalseCuandoNoExiste() {

        when(especialidadRepositorio.existsById(1))
                .thenReturn(false);

        boolean resultado =
                especialidadServicio.existeEspecialidad(1);

        assertFalse(resultado);

        verify(especialidadRepositorio).existsById(1);
    }

    @Test
    void existeEspecialidadNombre_deberiaRetornarTrueCuandoExiste() {

        when(especialidadRepositorio.existsByNombre("Cardiología"))
                .thenReturn(true);

        boolean resultado =
                especialidadServicio.existeEspecialidadNombre("Cardiología");

        assertTrue(resultado);

        verify(especialidadRepositorio)
                .existsByNombre("Cardiología");
    }

    @Test
    void existeEspecialidadNombre_deberiaRetornarFalseCuandoNoExiste() {

        when(especialidadRepositorio.existsByNombre("Cardiología"))
                .thenReturn(false);

        boolean resultado =
                especialidadServicio.existeEspecialidadNombre("Cardiología");

        assertFalse(resultado);

        verify(especialidadRepositorio)
                .existsByNombre("Cardiología");
    }

    @Test
    void listaNombres_deberiaRetornarNombresDeEspecialidades() {

        NombreEspecialidadesDTO nombreDTO =
                mock(NombreEspecialidadesDTO.class);

        List<NombreEspecialidadesDTO> nombres =
                List.of(nombreDTO);

        when(especialidadRepositorio.listarEspecialidades())
                .thenReturn(nombres);

        List<NombreEspecialidadesDTO> resultado =
                especialidadServicio.listaNombres();

        assertNotNull(resultado);
        assertEquals(1, resultado.size());
        assertEquals(nombres, resultado);

        verify(especialidadRepositorio)
                .listarEspecialidades();
    }
}