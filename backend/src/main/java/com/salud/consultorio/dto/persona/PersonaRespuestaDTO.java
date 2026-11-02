package com.salud.consultorio.dto.persona;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDate;

@Schema(description = "DTO de respuesta de información de una persona")
public record PersonaRespuestaDTO(

        @Schema(
                description = "Identificador único de la persona",
                example = "1"
        )
        Integer id,

        @Schema(
                description = "Documento Nacional de Identidad de la persona",
                example = "87654321"
        )
        String numeroDocumento,

        @Schema(
                description = "Nombres de la persona",
                example = "Ana"
        )
        String nombre,

        @Schema(
                description = "Apellidos de la persona",
                example = "Ramírez López"
        )
        String apellidos,

        @Schema(
                description = "Fecha de nacimiento de la persona",
                example = "1999-03-20"
        )
        LocalDate fechaNacimiento,

        @Schema(
                description = "Género de la persona",
                example = "Femenino"
        )
        String genero,

        @Schema(
                description = "Número telefónico de la persona",
                example = "987654321"
        )
        String telefono,

        @Schema(
                description = "Nacionalidad de la persona",
                example = "Peruana"
        )
        String nacionalidad,

        @Schema(
                description = "Correo electrónico de la persona",
                example = "ana@gmail.com"
        )
        String correo,

        @Schema(
                description = "Estado actual de la persona",
                example = "1"
        )
        Integer estado

) {
}