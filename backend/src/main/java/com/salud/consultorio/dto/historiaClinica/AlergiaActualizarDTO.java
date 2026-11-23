package com.salud.consultorio.dto.historiaClinica;

import com.salud.consultorio.model.enums.TipoAlergia;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record AlergiaActualizarDTO(
        @NotBlank(message = "La sustancia es obligatoria")
        @Size(max = 100, message = "La sustancia no puede superar los 100 caracteres") String sustancia,
        @NotNull(message = "El tipo de alergia es obligatorio") TipoAlergia tipoAlergia,
        @Size(max = 200, message = "La reacción no puede superar los 200 caracteres") String reaccion,
        @Size(max = 300, message = "La observación no puede superar los 300 caracteres") String observacion
) {}