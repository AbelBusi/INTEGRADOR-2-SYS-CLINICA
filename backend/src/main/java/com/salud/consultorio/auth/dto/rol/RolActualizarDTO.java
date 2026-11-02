package com.salud.consultorio.auth.dto.rol;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(description = "DTO para actualizar una especialidad médica")
public record RolActualizarDTO(

        @NotBlank(message = "El nombre es obligatorio")
        @Size(
                max = 40,
                message = "El nombre no puede superar los 40 caracteres"
        )
        @Schema(
                description = "Nombre de la especialidad médica",
                example = "Neurología"
        )
        String nombre,

        @NotBlank(message = "La descripción es obligatoria")
        @Size(
                max = 100,
                message = "La descripción no puede superar los 100 caracteres"
        )
        @Schema(
                description = "Descripción actualizada de la especialidad médica",
                example = "Especialidad enfocada en el sistema nervioso"
        )
        String descripcion

) {
}