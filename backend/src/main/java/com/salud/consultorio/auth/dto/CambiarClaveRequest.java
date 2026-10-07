package com.salud.consultorio.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CambiarClaveRequest(

        @NotBlank(message = "La contraseña actual es obligatoria")
        String claveActual,

        @NotBlank(message = "La nueva contraseña es obligatoria")
        @Size(min = 8, max = 100, message = "La nueva contraseña debe tener entre 8 y 100 caracteres")
        @Pattern(
                regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$",
                message = "La nueva contraseña debe tener mayúscula, minúscula y número"
        )
        String nuevaClave

) { }