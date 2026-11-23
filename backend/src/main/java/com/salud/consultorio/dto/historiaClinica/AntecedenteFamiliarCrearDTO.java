package com.salud.consultorio.dto.historiaClinica;

import com.salud.consultorio.model.enums.Parentesco;
import com.salud.consultorio.model.enums.TipoAntecedenteFamiliar;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record AntecedenteFamiliarCrearDTO(
        @NotNull(message = "El tipo es obligatorio") TipoAntecedenteFamiliar tipo,
        Parentesco parentesco,
        @NotBlank(message = "La descripción es obligatoria")
        @Size(max = 200, message = "La descripción no puede superar los 200 caracteres") String descripcion,
        @Size(max = 300, message = "La observación no puede superar los 300 caracteres") String observacion
) {}
