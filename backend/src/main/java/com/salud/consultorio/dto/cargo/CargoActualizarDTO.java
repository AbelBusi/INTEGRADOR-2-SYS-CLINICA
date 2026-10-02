package com.salud.consultorio.dto.cargo;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(description = "DTO para actualizar información de un cargo")
public record CargoActualizarDTO(

        @NotBlank(message = "El nombre del cargo es obligatorio")
        @Size(
                max = 60,
                message = "El nombre del cargo no debe exceder 60 caracteres"
        )
        @Schema(
                description = "Nombre del cargo",
                example = "Médico especialista"
        )
        String nombre,

        @NotBlank(message = "La descripción del cargo es obligatoria")
        @Size(
                max = 200,
                message = "La descripción del cargo no debe exceder 200 caracteres"
        )
        @Schema(
                description = "Descripción del cargo",
                example = "Profesional médico especializado encargado de la atención de pacientes"
        )
        String descripcion

) {
}