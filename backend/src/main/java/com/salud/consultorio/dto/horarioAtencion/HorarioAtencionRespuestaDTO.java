package com.salud.consultorio.dto.horarioAtencion;

import java.time.LocalTime;

public record HorarioAtencionRespuestaDTO(
        Integer idHorario,
        Integer diaSemana,
        LocalTime horaEntrada,
        LocalTime horaSalida
) {}