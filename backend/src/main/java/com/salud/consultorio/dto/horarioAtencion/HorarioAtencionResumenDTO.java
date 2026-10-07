package com.salud.consultorio.dto.horarioAtencion;

import java.time.LocalDate;
import java.time.LocalTime;

public record HorarioAtencionResumenDTO(
        Integer id,
        Integer idEmpleado,
        String empleado,
        String foto,
        Integer diaSemana,
        LocalTime horaEntrada,
        LocalTime horaSalida,
        LocalDate fechaInicio,
        LocalDate fechaFin,
        Integer estado
) {}