package com.salud.consultorio.dto.persona;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;

import java.time.LocalDate;

@Schema(description = "DTO para actualizar información de una persona")
public record PersonaActualizarDTO(

        @NotNull(message = "El tipo de documento es obligatorio")
        @Positive(message = "El tipo de documento debe ser válido")
        @Schema(
                description = "Identificador del tipo de documento",
                example = "1"
        )
        Integer tipoDocumento,

        @NotBlank(message = "El número de documento es obligatorio")
        @Size(max = 15, message = "El número de documento no debe exceder 15 caracteres")
        @Schema(
                description = "Número de documento de la persona",
                example = "87654321"
        )
        String numeroDocumento,

        @NotBlank(message = "El nombre es obligatorio")
        @Size(max = 60, message = "El nombre no debe exceder 60 caracteres")
        @Schema(
                description = "Nombres de la persona",
                example = "Luis"
        )
        String nombre,

        @NotBlank(message = "Los apellidos son obligatorios")
        @Size(max = 100, message = "Los apellidos no deben exceder 100 caracteres")
        @Schema(
                description = "Apellidos de la persona",
                example = "Torres Mendoza"
        )
        String apellidos,

        @NotNull(message = "La fecha de nacimiento es obligatoria")
        @Past(message = "La fecha de nacimiento debe ser en el pasado")
        @Schema(
                description = "Fecha de nacimiento de la persona",
                example = "1995-08-10"
        )
        LocalDate fechaNacimiento,

        @NotBlank(message = "El género es obligatorio")
        @Size(max = 30, message = "El género no debe exceder 30 caracteres")
        @Schema(
                description = "Género de la persona",
                example = "Masculino"
        )
        String genero,

        @Pattern(
                regexp = "^$|\\d{8,15}$",
                message = "El teléfono debe contener entre 8 y 15 dígitos"
        )
        @Schema(
                description = "Número telefónico de la persona. Es opcional y debe contener entre 8 y 15 dígitos",
                example = "912345678"
        )
        String telefono,

        @NotBlank(message = "La dirección es obligatoria")
        @Size(max = 150, message = "La dirección no debe exceder 150 caracteres")
        @Schema(
                description = "Dirección de domicilio de la persona",
                example = "Av. Balta 123"
        )
        String direccion,

        @Email(message = "El correo debe tener un formato válido")
        @Size(max = 100, message = "El correo no debe exceder 100 caracteres")
        @Schema(
                description = "Correo electrónico de la persona",
                example = "luis@gmail.com"
        )
        String correo,

        @NotBlank(message = "La nacionalidad es obligatoria")
        @Size(max = 50, message = "La nacionalidad no debe exceder 50 caracteres")
        @Schema(
                description = "Nacionalidad de la persona",
                example = "Peruana"
        )
        String nacionalidad

) {
}