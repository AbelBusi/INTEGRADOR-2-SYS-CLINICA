package com.salud.consultorio.impl;

import com.salud.consultorio.dto.horario.AgendaDTO;
import com.salud.consultorio.dto.horario.DisponibilidadDTO;
import com.salud.consultorio.dto.horario.HorarioTrabajoActualizarDTO;
import com.salud.consultorio.dto.horario.HorarioTrabajoCrearDTO;
import com.salud.consultorio.dto.horario.HorarioTrabajoLeerDTO;
import com.salud.consultorio.model.entity.Doctor;
import com.salud.consultorio.model.entity.HorarioTrabajo;
import com.salud.consultorio.model.entity.Persona;
import com.salud.consultorio.model.entity.Recepcionista;
import com.salud.consultorio.repository.ICitaMedicaRepositorio;
import com.salud.consultorio.repository.IDoctorRepositorio;
import com.salud.consultorio.repository.IHorarioTrabajoRepositorio;
import com.salud.consultorio.repository.IRecepcionistaRepositorio;
import com.salud.consultorio.service.IHorarioTrabajoServicio;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HorarioTrabajoServicioImpl implements IHorarioTrabajoServicio {

    private final IHorarioTrabajoRepositorio horarioTrabajoRepositorio;
    private final IDoctorRepositorio doctorRepositorio;
    private final IRecepcionistaRepositorio recepcionistaRepositorio;
    private final ICitaMedicaRepositorio citaMedicaRepositorio;

    @Transactional
    @Override
    public HorarioTrabajoLeerDTO crear(HorarioTrabajoCrearDTO dto) {

        validarHoras(dto.getHoraInicio(), dto.getHoraFin());

        Persona persona = resolverPersona(dto.getTipo(), dto.getReferenciaId());

        if (horarioTrabajoRepositorio.existeSolapamiento(persona.getId(), dto.getDiaSemana(), dto.getHoraInicio(), dto.getHoraFin(), 0)) {
            throw new DataIntegrityViolationException("El horario se superpone con otro horario existente para esa persona y día");
        }

        HorarioTrabajo horario = HorarioTrabajo.builder()
                .persona(persona)
                .tipo(dto.getTipo())
                .diaSemana(dto.getDiaSemana())
                .horaInicio(dto.getHoraInicio())
                .horaFin(dto.getHoraFin())
                .estado(1)
                .build();

        HorarioTrabajo guardado = horarioTrabajoRepositorio.save(horario);

        return horarioTrabajoRepositorio.obtenerDetallePorId(guardado.getId()).orElseThrow(
                () -> new EntityNotFoundException("No se pudo leer el horario creado")
        );
    }

    @Transactional
    @Override
    public HorarioTrabajoLeerDTO actualizar(HorarioTrabajoActualizarDTO dto, Integer id) {

        validarHoras(dto.getHoraInicio(), dto.getHoraFin());

        HorarioTrabajo horario = horarioTrabajoRepositorio.findById(id).orElseThrow(
                () -> new EntityNotFoundException("No existe el horario")
        );

        if (horarioTrabajoRepositorio.existeSolapamiento(horario.getPersona().getId(), dto.getDiaSemana(), dto.getHoraInicio(), dto.getHoraFin(), id)) {
            throw new DataIntegrityViolationException("El horario se superpone con otro horario existente para esa persona y día");
        }

        horario.setDiaSemana(dto.getDiaSemana());
        horario.setHoraInicio(dto.getHoraInicio());
        horario.setHoraFin(dto.getHoraFin());

        horarioTrabajoRepositorio.save(horario);

        return horarioTrabajoRepositorio.obtenerDetallePorId(id).orElseThrow(
                () -> new EntityNotFoundException("No se pudo leer el horario actualizado")
        );
    }

    @Transactional
    @Override
    public void eliminarPorId(Integer id) {
        if (!horarioTrabajoRepositorio.existsById(id)) {
            throw new EntityNotFoundException("No existe el horario");
        }
        horarioTrabajoRepositorio.cambiarEstado(0, id);
    }

    @Transactional(readOnly = true)
    @Override
    public List<HorarioTrabajoLeerDTO> listar() {
        return horarioTrabajoRepositorio.leerHorariosActivos();
    }

    @Transactional(readOnly = true)
    @Override
    public HorarioTrabajoLeerDTO obtenerPorId(Integer id) {
        return horarioTrabajoRepositorio.obtenerDetallePorId(id).orElseThrow(
                () -> new EntityNotFoundException("No existe el horario")
        );
    }

    @Transactional(readOnly = true)
    @Override
    public AgendaDTO agenda(String tipo, Integer referenciaId, LocalDate desde, LocalDate hasta) {
        if ("DOCTOR".equals(tipo)) {
            return new AgendaDTO(
                    horarioTrabajoRepositorio.bloquesDoctor(referenciaId),
                    citaMedicaRepositorio.citasDoctorRango(referenciaId, desde, hasta)
            );
        }
        return new AgendaDTO(
                horarioTrabajoRepositorio.bloquesRecepcionista(referenciaId),
                citaMedicaRepositorio.citasRecepcionistaRango(referenciaId, desde, hasta)
        );
    }

    @Transactional(readOnly = true)
    @Override
    public List<DisponibilidadDTO> doctoresDisponibles(LocalDate fecha, LocalTime horaInicio, LocalTime horaFin, Integer especialidadId) {
        validarHoras(horaInicio, horaFin);
        return horarioTrabajoRepositorio.doctoresDisponibles(fecha, fecha.getDayOfWeek().getValue(), horaInicio, horaFin, especialidadId);
    }

    @Transactional(readOnly = true)
    @Override
    public List<DisponibilidadDTO> recepcionistasDisponibles(LocalDate fecha, LocalTime horaInicio, LocalTime horaFin) {
        validarHoras(horaInicio, horaFin);
        return horarioTrabajoRepositorio.recepcionistasDisponibles(fecha, fecha.getDayOfWeek().getValue(), horaInicio, horaFin);
    }

    @Transactional(readOnly = true)
    @Override
    public boolean doctorTrabajaEn(Integer doctorId, Integer diaSemana, LocalTime horaInicio, LocalTime horaFin) {
        return horarioTrabajoRepositorio.doctorTrabajaEn(doctorId, diaSemana, horaInicio, horaFin);
    }

    @Transactional(readOnly = true)
    @Override
    public boolean recepcionistaTrabajaEn(Integer recepcionistaId, Integer diaSemana, LocalTime horaInicio, LocalTime horaFin) {
        return horarioTrabajoRepositorio.recepcionistaTrabajaEn(recepcionistaId, diaSemana, horaInicio, horaFin);
    }

    private void validarHoras(LocalTime horaInicio, LocalTime horaFin) {
        if (horaInicio == null || horaFin == null || !horaInicio.isBefore(horaFin)) {
            throw new DataIntegrityViolationException("La hora de inicio debe ser menor a la hora de fin");
        }
    }

    private Persona resolverPersona(String tipo, Integer referenciaId) {
        if ("DOCTOR".equals(tipo)) {
            Doctor doctor = doctorRepositorio.findByIdConPersona(referenciaId).orElseThrow(
                    () -> new EntityNotFoundException("El doctor no existe en la entidad")
            );
            return doctor.getPersona();
        }
        Recepcionista recepcionista = recepcionistaRepositorio.findByIdConRecepcionista(referenciaId).orElseThrow(
                () -> new EntityNotFoundException("El recepcionista no existe en la entidad")
        );
        return recepcionista.getPersona();
    }
}
