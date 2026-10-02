package com.salud.consultorio.dto.horarioAtencion;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.time.LocalTime;

@Schema(description = "DTO que representa el horario de atención de un día")
public record HorarioAtencionDTO(

        @NotNull(message = "El día de la semana es obligatorio")
        @Min(value = 1, message = "El día de la semana debe estar entre 1 y 7")
        @Max(value = 7, message = "El día de la semana debe estar entre 1 y 7")
        @Schema(
                description = "Día de la semana: 1=Lunes, 2=Martes, ..., 7=Domingo",
                example = "1"
        )
        Integer diaSemana,

        @NotNull(message = "La hora de entrada es obligatoria")
        @Schema(
                description = "Hora de inicio de la atención",
                example = "08:00:00"
        )
        LocalTime horaEntrada,

        @NotNull(message = "La hora de salida es obligatoria")
        @Schema(
                description = "Hora de finalización de la atención",
                example = "13:00:00"
        )
        LocalTime horaSalida

) {}