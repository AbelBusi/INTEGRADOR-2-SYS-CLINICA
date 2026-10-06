package com.salud.consultorio.auth.dto.rol;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "DTO de respuesta de especialidad médica")
public record IRolRespuestaDTO(

        @Schema(
                description = "Identificador único de la especialidad médica",
                example = "1"
        )
        Integer id,

        @Schema(
                description = "Nombre de la especialidad médica",
                example = "Pediatría"
        )
        String nombre,

        @Schema(
                description = "Descripción de la especialidad médica",
                example = "Especialidad médica enfocada en la atención infantil"
        )
        String descripcion,

        @Schema(
                description = "Estado actual de la especialidad médica",
                example = "1"
        )
        Integer estado

) {
}