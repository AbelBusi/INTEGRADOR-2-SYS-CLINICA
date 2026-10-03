package com.salud.consultorio.auth.dto;

import jakarta.validation.constraints.NotBlank;

public record RecuperarClaveRequest(
        @NotBlank(message = "El usuario es obligatorio")
        String usuario
) { }