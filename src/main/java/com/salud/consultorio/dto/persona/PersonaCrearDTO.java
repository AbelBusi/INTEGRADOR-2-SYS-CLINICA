package com.salud.consultorio.dto.persona;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Schema(description = "DTO para registrar información de una persona")
public class PersonaCrearDTO {

    @NotBlank(message = "El DNI es obligatorio")
    @Size(min = 8, max = 8, message = "El DNI debe tener 8 dígitos")
    @Pattern(regexp = "\\d{8}", message = "El DNI solo debe contener números")
    @Schema(
            description = "Documento Nacional de Identidad de la persona",
            example = "87654321"
    )
    private String dni;

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 70, message = "El nombre no debe exceder 70 caracteres")
    @Schema(
            description = "Nombres de la persona",
            example = "María"
    )
    private String nombre;

    @NotBlank(message = "Los apellidos son obligatorios")
    @Size(max = 100, message = "Los apellidos no deben exceder 100 caracteres")
    @Schema(
            description = "Apellidos de la persona",
            example = "Gonzales Pérez"
    )
    private String apellidos;

    @NotNull(message = "La fecha de nacimiento es obligatoria")
    @Past(message = "La fecha de nacimiento debe ser en el pasado")
    @Schema(
            description = "Fecha de nacimiento de la persona",
            example = "1998-04-15"
    )
    private LocalDate fechaNacimiento;

    @NotBlank(message = "El género es obligatorio")
    @Size(max = 20, message = "El género no debe exceder 20 caracteres")
    @Schema(
            description = "Género de la persona",
            example = "Femenino"
    )
    private String genero;

    @Pattern(regexp = "\\d{9}", message = "El teléfono debe tener 9 dígitos")
    @Schema(
            description = "Número telefónico de la persona",
            example = "987654321"
    )
    private String telefono;

    @NotBlank(message = "La nacionalidad es obligatoria")
    @Size(max = 50, message = "La nacionalidad no debe exceder 50 caracteres")
    @Schema(
            description = "Nacionalidad de la persona",
            example = "Peruana"
    )
    private String nacionalidad;

    @Email(message = "El correo debe tener un formato válido")
    @Size(max = 100, message = "El correo no debe exceder 100 caracteres")
    @Schema(
            description = "Correo electrónico de la persona",
            example = "maria@gmail.com"
    )
    private String correo;

    @Schema(
            description = "Estado de la persona",
            example = "1"
    )
    private Integer estado;
}