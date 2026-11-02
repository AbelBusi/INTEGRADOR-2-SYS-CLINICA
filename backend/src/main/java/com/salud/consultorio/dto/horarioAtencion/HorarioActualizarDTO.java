package com.salud.consultorio.dto.horarioAtencion;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalTime;

@Schema(description = "DTO para actualizar un horario de atención")
public record HorarioActualizarDTO(

        @NotNull(message = "El día de la semana es obligatorio")
        @Min(value = 1, message = "El día de la semana debe estar entre 1 y 7")
        @Max(value = 7, message = "El día de la semana debe estar entre 1 y 7")
        @Schema(description = "Día de la semana: 1=Lunes ... 7=Domingo", example = "1")
        Integer diaSemana,

        @NotNull(message = "La hora de entrada es obligatoria")
        @Schema(example = "08:00:00")
        LocalTime horaEntrada,

        @NotNull(message = "La hora de salida es obligatoria")
        @Schema(example = "13:00:00")
        LocalTime horaSalida,

        @NotNull(message = "La fecha de inicio es obligatoria")
        @Schema(example = "2026-10-05")
        LocalDate fechaInicio,

        @NotNull(message = "La fecha de fin es obligatoria")
        @Schema(example = "2026-12-31")
        LocalDate fechaFin

) {}