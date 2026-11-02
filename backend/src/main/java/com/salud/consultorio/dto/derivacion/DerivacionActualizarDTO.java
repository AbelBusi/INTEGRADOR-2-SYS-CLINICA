package com.salud.consultorio.dto.derivacion;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record DerivacionActualizarDTO(
        @NotNull Integer idEspecialidad,
        Integer urgencia,
        @NotBlank @Size(max = 200) String motivo
) {
}