package com.salud.consultorio.dto.citaMedica;

import java.time.LocalDate;
import java.time.LocalTime;

public record CitaMedicaRespuestaDTO(
        Integer id,
        Integer idPaciente,
        String paciente,
        Integer idMedico,
        String medico,
        Integer idUsuario,
        LocalDate fechaCita,
        LocalTime horaInicio,
        LocalTime horaSalida,
        String motivo,
        Integer estado
) {}