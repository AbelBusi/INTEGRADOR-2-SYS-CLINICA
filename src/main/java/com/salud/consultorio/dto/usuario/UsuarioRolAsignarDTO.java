package com.salud.consultorio.dto.usuario;

import jakarta.validation.constraints.NotNull;

public record UsuarioRolAsignarDTO(
        @NotNull(message = "El id del rol es obligatorio")
        Integer idRol
) {
}