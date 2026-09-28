package com.salud.consultorio.servicios;

import com.salud.consultorio.dto.citaMedica.*;
import com.salud.consultorio.dto.persona.PersonaCrearDTO;
import com.salud.consultorio.dto.recepcionista.RecepcionistaRefCitaMedicaDTO;
import com.salud.consultorio.impl.CitaMedicaServicioImpl;
import com.salud.consultorio.impl.ReferenciaServicio;
import com.salud.consultorio.dto.paciente.PacienteCrearDTO;
import com.salud.consultorio.model.entity.*;
import com.salud.consultorio.model.mapper.ICitaMedicaMapper;
import com.salud.consultorio.model.mapper.IPacienteMapper;
import com.salud.consultorio.model.mapper.IPersonaMapper;
import com.salud.consultorio.repository.ICitaMedicaRepositorio;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import jakarta.persistence.EntityNotFoundException;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(org.mockito.junit.jupiter.MockitoExtension.class)
class CitaMedicaServicioImplTest {

    @Mock
    private ICitaMedicaRepositorio citaRepo;

    @Mock
    private ReferenciaServicio referenciaServicio;

    @Mock
    private ICitaMedicaMapper citaMapper;

    @Mock
    private IPacienteMapper pacienteMapper;

    @Mock
    private IPersonaMapper personaMapper;

    @InjectMocks
    private CitaMedicaServicioImpl service;

    // mocks de entidades
    private Doctor doctor = new Doctor();
    private Especialidad especialidad = new Especialidad();
    private Recepcionista recepcionista = new Recepcionista();
    private Paciente paciente = new Paciente();
    private Persona persona = new Persona();
    private CitaMedica cita = new CitaMedica();

    // =========================
    // 1. listarTodos
    // =========================
    @Test
    void listarTodos_ok() {
        when(citaRepo.findAll()).thenReturn(List.of(new CitaMedica()));

        var result = service.listarTodos();

        assertFalse(result.isEmpty());
        verify(citaRepo).findAll();
    }

    // =========================
    // 2. obtenerPorId OK
    // =========================
    @Test
    void obtenerPorId_ok() {
        when(citaRepo.findById(1)).thenReturn(Optional.of(cita));

        var result = service.obtenerPorId(1);

        assertTrue(result.isPresent());
    }

    // =========================
    // 3. crear OK
    // =========================
    @Test
    void crear_ok() {
        var dto = mock(CitaMedicaDTO.class);

        // 👇 mocks correctos
        var doctorRef = mock(DoctorRefCitaMedicaDTO.class);
        when(doctorRef.getId()).thenReturn(1);

        var especialidadRef = mock(EspecialidadRefCitaMedicaDTO.class);
        when(especialidadRef.getId()).thenReturn(1);

        var recepcionistaRef = mock(RecepcionistaRefCitaMedicaDTO.class);
        when(recepcionistaRef.getId()).thenReturn(1);

        var pacienteDTO = mockPacienteDTO();

        when(dto.getDoctor()).thenReturn(doctorRef);
        when(dto.getEspecialidad()).thenReturn(especialidadRef);
        when(dto.getRecepcionista()).thenReturn(recepcionistaRef);
        when(dto.getPaciente()).thenReturn(pacienteDTO);

        when(referenciaServicio.getRef(eq(Doctor.class), anyInt())).thenReturn(doctor);
        when(referenciaServicio.getRef(eq(Especialidad.class), anyInt())).thenReturn(especialidad);
        when(referenciaServicio.getRef(eq(Recepcionista.class), anyInt())).thenReturn(recepcionista);

        when(pacienteMapper.pacienteDtoToPaciente(any())).thenReturn(paciente);
        when(personaMapper.personaDtoToPersona(any())).thenReturn(persona);
        when(citaMapper.citaMedicaDtoToCitaMedica(any())).thenReturn(cita);

        when(citaRepo.save(any())).thenReturn(cita);

        var result = service.crear(dto);

        assertNotNull(result);
        verify(citaRepo).save(any());
    }
    // =========================
    // 4. actualizarCita OK
    // =========================
    @Test
    void actualizarCita_ok() {
        var dto = mock(CitaMedicaActualizarDTO.class);

        when(citaRepo.findById(1)).thenReturn(Optional.of(cita));

        var doctorRef = mock(DoctorRefCitaMedicaDTO.class);
        when(doctorRef.getId()).thenReturn(1);

        var especialidadRef = mock(EspecialidadRefCitaMedicaDTO.class);
        when(especialidadRef.getId()).thenReturn(1);

        var pacienteRef = mock(PacienteRefCitaMedicaDTO.class);
        when(pacienteRef.getId()).thenReturn(1);

        var recepcionistaRef = mock(RecepcionistaRefCitaMedicaDTO.class);
        when(recepcionistaRef.getId()).thenReturn(1);

        when(dto.getDoctor()).thenReturn(doctorRef);
        when(dto.getEspecialidad()).thenReturn(especialidadRef);
        when(dto.getPaciente()).thenReturn(pacienteRef);
        when(dto.getRecepcionista()).thenReturn(recepcionistaRef);

        when(referenciaServicio.getRef(eq(Doctor.class), anyInt())).thenReturn(doctor);
        when(referenciaServicio.getRef(eq(Especialidad.class), anyInt())).thenReturn(especialidad);
        when(referenciaServicio.getRef(eq(Paciente.class), anyInt())).thenReturn(paciente);
        when(referenciaServicio.getRef(eq(Recepcionista.class), anyInt())).thenReturn(recepcionista);

        when(citaRepo.save(any())).thenReturn(cita);

        var result = service.actualizarCita(dto, 1);

        assertNotNull(result);
        verify(citaRepo).save(cita);
    }
    // =========================
    // 5. actualizarCita NOT FOUND
    // =========================
    @Test
    void actualizarCita_notFound() {
        var dto = mock(CitaMedicaActualizarDTO.class);

        when(citaRepo.findById(1)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> {
            service.actualizarCita(dto, 1);
        });
    }

    // =========================
    // 6. eliminar OK
    // =========================
    @Test
    void eliminar_ok() {
        when(citaRepo.findById(1)).thenReturn(Optional.of(cita));

        service.eliminarPorId(1);

        assertEquals(0, cita.getEstado());
        verify(citaRepo).save(cita);
    }

    // =========================
    // 7. eliminar NOT FOUND
    // =========================
    @Test
    void eliminar_notFound() {
        when(citaRepo.findById(1)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> {
            service.eliminarPorId(1);
        });
    }

    // =========================
    // 8. mostrarCitaMedicaPorId OK
    // =========================
    @Test
    void mostrarCita_ok() {
        cita.setId(1);

        when(citaRepo.findById(1)).thenReturn(Optional.of(cita));
        when(citaMapper.citaMedicaToCitaMedicaDto(cita)).thenReturn(new CitaMedicaDTO());

        var result = service.mostrarCitaMedicaPorId(cita);

        assertNotNull(result);
    }

    // =========================
    // 9. mostrarCita NOT FOUND
    // =========================
    @Test
    void mostrarCita_notFound() {
        cita.setId(1);

        when(citaRepo.findById(1)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> {
            service.mostrarCitaMedicaPorId(cita);
        });
    }

    // =========================
    // 10. leerCitasMedicas
    // =========================
    @Test
    void leerCitasMedicas_ok() {
        when(citaRepo.leerCitasMedicas()).thenReturn(List.of());

        var result = service.leerCitasMedicas();

        assertNotNull(result);
        verify(citaRepo).leerCitasMedicas();
    }

    // =========================
    // Helpers
    // =========================

    private RecepcionistaRefCitaMedicaDTO mockRef(int id) {
        RecepcionistaRefCitaMedicaDTO ref = mock(RecepcionistaRefCitaMedicaDTO.class);
        when(ref.getId()).thenReturn(id);
        return ref;
    }

    private PacienteCrearDTO mockPacienteDTO() {
        PacienteCrearDTO dto = mock(PacienteCrearDTO.class);
        when(dto.getPersona()).thenReturn(mock(PersonaCrearDTO.class));
        return dto;
    }
}