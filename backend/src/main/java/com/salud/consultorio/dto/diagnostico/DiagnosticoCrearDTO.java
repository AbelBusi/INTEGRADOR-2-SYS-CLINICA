package com.salud.consultorio.dto.diagnostico;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record DiagnosticoCrearDTO(
        @NotBlank @Size(max = 300) String descripcion,
        @NotNull Integer tipoDiagnostico,
        @NotBlank @Size(max = 300) String observaciones
) {
}