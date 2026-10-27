package com.salud.consultorio.dto.indicacion;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public record IndicacionCrearDTO(
        @NotBlank(message = "El tipo de indicación es obligatorio")
        @Size(max = 30, message = "El tipo de indicación no puede superar los 30 caracteres")
        String tipoIndicacion,

        @NotBlank(message = "La descripción es obligatoria")
        @Size(max = 300, message = "La descripción no puede superar los 300 caracteres")
        String descripcion,

        @NotNull(message = "Los días de reposo son obligatorios (use 0 si no aplica)")
        @PositiveOrZero(message = "Los días de reposo no pueden ser negativos")
        Integer diasReposo,

        @NotBlank(message = "La frecuencia es obligatoria")
        @Size(max = 40, message = "La frecuencia no puede superar los 40 caracteres")
        String frecuencia
) {
}