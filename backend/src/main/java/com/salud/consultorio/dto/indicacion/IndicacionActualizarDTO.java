package com.salud.consultorio.dto.indicacion;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record IndicacionActualizarDTO(
        @NotBlank @Size(max = 30) String tipoIndicacion,
        @NotBlank @Size(max = 300) String descripcion,
        @NotNull @Min(0) Integer diasReposo,
        @NotBlank @Size(max = 40) String frecuencia
) {
}