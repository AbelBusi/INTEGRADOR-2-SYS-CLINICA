package com.salud.consultorio.dto.persona;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Schema(description = "DTO de respuesta de información de una persona")
public class PersonaRespuestaDTO {

    @Schema(
            description = "Identificador único de la persona",
            example = "1"
    )
    private Integer id;

    @Schema(
            description = "Documento Nacional de Identidad de la persona",
            example = "87654321"
    )
    private String dni;

    @Schema(
            description = "Nombres de la persona",
            example = "Ana"
    )
    private String nombre;

    @Schema(
            description = "Apellidos de la persona",
            example = "Ramírez López"
    )
    private String apellidos;

    @Schema(
            description = "Fecha de nacimiento de la persona",
            example = "1999-03-20"
    )
    private LocalDate fechaNacimiento;

    @Schema(
            description = "Género de la persona",
            example = "Femenino"
    )
    private String genero;

    @Schema(
            description = "Número telefónico de la persona",
            example = "987654321"
    )
    private String telefono;

    @Schema(
            description = "Nacionalidad de la persona",
            example = "Peruana"
    )
    private String nacionalidad;

    @Schema(
            description = "Correo electrónico de la persona",
            example = "ana@gmail.com"
    )
    private String correo;

    @Schema(
            description = "Estado actual de la persona",
            example = "1"
    )
    private Integer estado;
}