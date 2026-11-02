package com.salud.consultorio.auth.dto;

import jakarta.validation.constraints.NotNull;

public record CambiarPerfilRequest(

        @NotNull(message = "El perfil es obligatorio")
        Integer idRol

) {
}