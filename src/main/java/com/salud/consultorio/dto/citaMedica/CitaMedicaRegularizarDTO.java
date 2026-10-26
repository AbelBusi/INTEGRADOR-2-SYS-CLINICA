package com.salud.consultorio.dto.citaMedica;

import com.salud.consultorio.model.enums.ResolucionRegularizacion;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CitaMedicaRegularizarDTO(
        @NotNull(message = "La resolución es obligatoria")
        ResolucionRegularizacion resolucion,
        @NotBlank(message = "La justificación es obligatoria")
        @Size(max = 300, message = "La justificación no puede superar los 300 caracteres")
        String observacion
) {}