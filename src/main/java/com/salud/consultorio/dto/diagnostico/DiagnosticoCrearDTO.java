package com.salud.consultorio.dto.diagnostico;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record DiagnosticoCrearDTO(
        @NotBlank(message = "El código del diagnóstico es obligatorio")
        @Size(max = 15, message = "El código no puede superar los 15 caracteres")
        String codigo,

        @NotBlank(message = "La descripción es obligatoria")
        @Size(max = 300, message = "La descripción no puede superar los 300 caracteres")
        String descripcion,

        @NotNull(message = "El tipo de diagnóstico es obligatorio")
        Integer tipoDiagnostico,

        @NotBlank(message = "Las observaciones son obligatorias")
        @Size(max = 300, message = "Las observaciones no pueden superar los 300 caracteres")
        String observaciones
) {
}