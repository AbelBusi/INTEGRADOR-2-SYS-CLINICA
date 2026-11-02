package com.salud.consultorio.dto.derivacion;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record DerivacionCrearDTO(
        @NotNull(message = "La especialidad es obligatoria")
        Integer idEspecialidad,

        @NotBlank(message = "El motivo de la derivación es obligatorio")
        @Size(max = 200, message = "El motivo no puede superar los 200 caracteres")
        String motivo,

        Integer urgencia
) {
}