package com.salud.consultorio.auth.dto.registro;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record VerificarIdentidadRequest(

        @NotBlank(message = "Selecciona el tipo de documento")
        @Size(max = 10, message = "Tipo de documento inválido")
        String tipoDocumento,

        @NotBlank(message = "Ingresa el número de documento")
        @Size(max = 15, message = "El número de documento es demasiado largo")
        @Pattern(regexp = "^[A-Za-z0-9]+$", message = "El número de documento solo admite letras y números")
        String numeroDocumento,

        @NotBlank(message = "Ingresa tus nombres")
        @Size(max = 60, message = "Los nombres son demasiado largos")
        String nombres,

        @NotBlank(message = "Ingresa tus apellidos")
        @Size(max = 100, message = "Los apellidos son demasiado largos")
        String apellidos,

        @NotNull(message = "Ingresa tu fecha de nacimiento")
        @Past(message = "La fecha de nacimiento debe ser anterior a hoy")
        LocalDate fechaNacimiento
) {}
