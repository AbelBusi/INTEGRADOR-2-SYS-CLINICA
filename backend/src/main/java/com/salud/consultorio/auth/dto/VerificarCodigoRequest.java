package com.salud.consultorio.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record VerificarCodigoRequest(
        @NotBlank(message = "El usuario es obligatorio")
        String usuario,
        @NotBlank @Pattern(regexp = "\\d{6}", message = "El código debe tener 6 dígitos")
        String codigo
) { }