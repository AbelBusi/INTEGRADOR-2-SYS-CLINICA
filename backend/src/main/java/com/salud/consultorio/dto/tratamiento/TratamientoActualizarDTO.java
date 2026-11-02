package com.salud.consultorio.dto.tratamiento;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record TratamientoActualizarDTO(
        @NotBlank @Size(max = 100) String nombreMedicamento,
        @NotBlank @Size(max = 40) String dosis,
        @NotBlank @Size(max = 30) String viaAdministracion,
        @NotBlank @Size(max = 40) String frecuencia,
        @NotNull @Min(1) Integer duracionDias,
        @NotNull @Min(1) Integer totCantidad,
        @NotBlank @Size(max = 300) String descIndicacion
) {
}