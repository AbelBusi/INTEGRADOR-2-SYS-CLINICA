package com.salud.consultorio.service;

import com.salud.consultorio.dto.horario.AgendaDTO;
import com.salud.consultorio.dto.horario.DisponibilidadDTO;
import com.salud.consultorio.dto.horario.HorarioTrabajoActualizarDTO;
import com.salud.consultorio.dto.horario.HorarioTrabajoCrearDTO;
import com.salud.consultorio.dto.horario.HorarioTrabajoLeerDTO;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface IHorarioTrabajoServicio {

    AgendaDTO agenda(String tipo, Integer referenciaId, LocalDate desde, LocalDate hasta);

    HorarioTrabajoLeerDTO crear(HorarioTrabajoCrearDTO dto);

    HorarioTrabajoLeerDTO actualizar(HorarioTrabajoActualizarDTO dto, Integer id);

    void eliminarPorId(Integer id);

    List<HorarioTrabajoLeerDTO> listar();

    HorarioTrabajoLeerDTO obtenerPorId(Integer id);

    List<DisponibilidadDTO> doctoresDisponibles(LocalDate fecha, LocalTime horaInicio, LocalTime horaFin, Integer especialidadId);

    List<DisponibilidadDTO> recepcionistasDisponibles(LocalDate fecha, LocalTime horaInicio, LocalTime horaFin);

    boolean doctorTrabajaEn(Integer doctorId, Integer diaSemana, LocalTime horaInicio, LocalTime horaFin);

    boolean recepcionistaTrabajaEn(Integer recepcionistaId, Integer diaSemana, LocalTime horaInicio, LocalTime horaFin);

}
