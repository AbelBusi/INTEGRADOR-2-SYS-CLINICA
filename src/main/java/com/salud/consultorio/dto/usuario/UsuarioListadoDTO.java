package com.salud.consultorio.dto.usuario;

import java.time.LocalDateTime;

public record UsuarioListadoDTO(
        Integer id,
        String persona,
        String nombreUsuario,
        String rol,
        LocalDateTime fechaCreacion,
        LocalDateTime fechaActualizacion,
        boolean requiereCambioClave,
        Integer estado
) {
}