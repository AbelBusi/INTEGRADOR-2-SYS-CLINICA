package com.salud.consultorio.dto.citaMedica;

import com.salud.consultorio.model.enums.MotivoRegularizacionAdministrativa;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CitaMedicaRegularizarAdministrativoDTO(
        @NotNull(message = "El motivo es obligatorio")
        MotivoRegularizacionAdministrativa motivo,

        @NotBlank(message = "La justificación es obligatoria")
        @Size(max = 300, message = "La observación no puede superar los 300 caracteres.")
        String observacion,

        @Valid
        CitaMedicaActualizarDTO reprogramacion
) {}