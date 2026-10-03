package com.salud.consultorio.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record RecuperarClaveRequest(
        @NotBlank(message = "El usuario es obligatorio")
        String usuario,

        @NotBlank(message = "El número de documento es obligatorio")
        @Size(max = 15, message = "El número de documento no puede superar 15 caracteres")
        String numeroDocumento,

        @NotNull(message = "El canal es obligatorio (CORREO o SMS)")
        CanalRecuperacion canal,

        // Correo o teléfono, según el canal elegido
        @NotBlank(message = "El correo o teléfono es obligatorio")
        @Size(max = 100, message = "El dato de contacto es demasiado largo")
        String destino
) { }