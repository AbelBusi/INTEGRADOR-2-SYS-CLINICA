package com.salud.consultorio.auth.dto.registro;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ElegibilidadRegistroRequest(

        @NotBlank(message = "Selecciona el tipo de documento")
        @Size(max = 10, message = "Tipo de documento inválido")
        String tipoDocumento,

        @NotBlank(message = "Ingresa el número de documento")
        @Size(max = 15, message = "El número de documento es demasiado largo")
        @Pattern(regexp = "^[A-Za-z0-9]+$", message = "El número de documento solo admite letras y números")
        String numeroDocumento
) {}