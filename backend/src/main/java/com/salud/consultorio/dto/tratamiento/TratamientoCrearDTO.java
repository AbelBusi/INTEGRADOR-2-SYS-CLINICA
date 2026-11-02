package com.salud.consultorio.dto.tratamiento;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record TratamientoCrearDTO(
        @NotBlank(message = "El nombre del medicamento es obligatorio")
        @Size(max = 100, message = "El nombre del medicamento no puede superar los 100 caracteres")
        String nombreMedicamento,

        @NotBlank(message = "La dosis es obligatoria")
        @Size(max = 40, message = "La dosis no puede superar los 40 caracteres")
        String dosis,

        @NotBlank(message = "La vía de administración es obligatoria")
        @Size(max = 30, message = "La vía de administración no puede superar los 30 caracteres")
        String viaAdministracion,

        @NotBlank(message = "La frecuencia es obligatoria")
        @Size(max = 40, message = "La frecuencia no puede superar los 40 caracteres")
        String frecuencia,

        @NotNull(message = "La duración en días es obligatoria")
        @Positive(message = "La duración en días debe ser mayor a 0")
        Integer duracionDias,

        @NotNull(message = "La cantidad total es obligatoria")
        @Positive(message = "La cantidad total debe ser mayor a 0")
        Integer totCantidad,

        @NotBlank(message = "La descripción de la indicación es obligatoria")
        @Size(max = 300, message = "La descripción de la indicación no puede superar los 300 caracteres")
        String descIndicacion
) {
}