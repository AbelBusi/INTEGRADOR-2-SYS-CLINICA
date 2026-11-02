package com.salud.consultorio.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RestablecerClaveRequest(
        @NotBlank(message = "El usuario es obligatorio")
        String usuario,
        @NotBlank @Pattern(regexp = "\\d{6}", message = "El código debe tener 6 dígitos")
        String codigo,
        @NotBlank @Size(min = 6, max = 100, message = "La clave debe tener mínimo 6 caracteres")
        String nuevaClave
) { }