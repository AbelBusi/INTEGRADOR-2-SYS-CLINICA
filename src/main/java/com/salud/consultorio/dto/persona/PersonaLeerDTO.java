package com.salud.consultorio.dto.persona;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@Schema(description = "DTO de lectura de información de personas")
public class PersonaLeerDTO {

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
            example = "Carlos"
    )
    private String nombre;

    @Schema(
            description = "Apellidos de la persona",
            example = "Fernández Ruiz"
    )
    private String apellidos;

    @Schema(
            description = "Fecha de nacimiento de la persona",
            example = "1997-06-15"
    )
    private LocalDate fechaNacimiento;

    @Schema(
            description = "Género de la persona",
            example = "Masculino"
    )
    private String genero;

    @Schema(
            description = "Número telefónico de la persona",
            example = "923456789"
    )
    private String telefono;

    @Schema(
            description = "Nacionalidad de la persona",
            example = "Peruana"
    )
    private String nacionalidad;

    @Schema(
            description = "Correo electrónico de la persona",
            example = "carlos@gmail.com"
    )
    private String correo;

    public PersonaLeerDTO(
            Integer id,
            String dni,
            String nombre,
            String apellidos,
            LocalDate fechaNacimiento,
            String genero,
            String telefono,
            String nacionalidad,
            String correo
    ) {
        this.id = id;
        this.dni = dni;
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.fechaNacimiento = fechaNacimiento;
        this.genero = genero;
        this.telefono = telefono;
        this.nacionalidad = nacionalidad;
        this.correo = correo;
    }
}