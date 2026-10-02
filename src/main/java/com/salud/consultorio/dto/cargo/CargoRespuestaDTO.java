package com.salud.consultorio.dto.cargo;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "DTO de respuesta de información de un cargo")
public record CargoRespuestaDTO(

        @Schema(
                description = "Identificador único del cargo",
                example = "1"
        )
        Integer id,

        @Schema(
                description = "Nombre del cargo",
                example = "Médico"
        )
        String nombre,

        @Schema(
                description = "Descripción del cargo",
                example = "Profesional encargado de la atención médica de los pacientes"
        )
        String descripcion,

        @Schema(
                description = "Estado actual del cargo. 1 = activo, 0 = inactivo",
                example = "1"
        )
        Integer estado

) {
}