package com.salud.consultorio.dto.historiaClinica;

import com.salud.consultorio.model.enums.TipoAntecedentePersonal;
import jakarta.validation.constraints.*;

public record AntecedentePersonalCrearDTO(
        @NotNull(message = "El tipo es obligatorio") TipoAntecedentePersonal tipo,
        @NotBlank(message = "La descripción es obligatoria")
        @Size(max = 200, message = "La descripción no puede superar los 200 caracteres") String descripcion,
        @Min(value = 1900, message = "El año no es válido") @Max(value = 2100, message = "El año no es válido") Integer anio,
        @Size(max = 300, message = "La observación no puede superar los 300 caracteres") String observacion
) {}