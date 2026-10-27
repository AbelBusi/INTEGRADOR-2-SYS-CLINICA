package com.salud.consultorio.dto.examenSolicitado;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ExamenSolicitadoCrearDTO(
        @NotBlank(message = "El motivo del examen es obligatorio")
        @Size(max = 200, message = "El motivo no puede superar los 200 caracteres")
        String motivo
) {
}