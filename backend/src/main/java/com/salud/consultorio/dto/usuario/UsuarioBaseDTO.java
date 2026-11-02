package com.salud.consultorio.dto.usuario;

public record UsuarioBaseDTO(
        Integer id,
        String usuario,
        String nombreCompleto,
        String numeroDocumento,
        Integer estado
) {
}