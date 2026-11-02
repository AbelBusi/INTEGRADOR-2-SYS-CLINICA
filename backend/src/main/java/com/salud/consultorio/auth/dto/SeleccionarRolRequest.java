package com.salud.consultorio.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record SeleccionarRolRequest(

        @NotBlank(message = "El token de selección es obligatorio")
        String tokenSeleccion,

        @NotNull(message = "El perfil es obligatorio")
        Integer idRol

) {
}