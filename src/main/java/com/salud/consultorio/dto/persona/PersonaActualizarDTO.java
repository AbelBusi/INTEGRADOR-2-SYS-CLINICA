package com.salud.consultorio.dto.persona;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Schema(description = "DTO para actualizar información de una persona")
public class PersonaActualizarDTO {

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
            example = "Luis"
    )
    private String nombre;

    @NotBlank(message = "Los apellidos son obligatorios")
    @Size(max = 100, message = "Los apellidos no deben exceder 100 caracteres")
    @Schema(
            description = "Apellidos de la persona",
            example = "Torres Mendoza"
    )
    private String apellidos;

    @NotNull(message = "La fecha de nacimiento es obligatoria")
    @Past(message = "La fecha de nacimiento debe ser en el pasado")
    @Schema(
            description = "Fecha de nacimiento de la persona",
            example = "1995-08-10"
    )
    private LocalDate fechaNacimiento;

    @NotBlank(message = "El género es obligatorio")
    @Size(max = 20, message = "El género no debe exceder 20 caracteres")
    @Schema(
            description = "Género de la persona",
            example = "Masculino"
    )
    private String genero;

    @Pattern(regexp = "\\d{9}", message = "El teléfono debe tener 9 dígitos")
    @Schema(
            description = "Número telefónico de la persona",
            example = "912345678"
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
            example = "luis@gmail.com"
    )
    private String correo;

    @Schema(
            description = "Estado actual de la persona",
            example = "1"
    )
    private Integer estado;

}