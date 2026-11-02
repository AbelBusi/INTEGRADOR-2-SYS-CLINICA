package com.salud.consultorio.dto.usuario;

public record UsuarioRolAsignadoDTO(
        Integer idUsuario,
        Integer idRol,
        String nombreRol
) {
}