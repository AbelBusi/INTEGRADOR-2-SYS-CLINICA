package com.salud.consultorio.dto.horarioAtencion;

import java.time.LocalTime;

public record HorarioAtencionResumenDTO(
        Integer id,
        Integer idEmpleado,
        String empleado,
        String foto,
        Integer diaSemana,
        LocalTime horaEntrada,
        LocalTime horaSalida,
        Integer estado
) {}