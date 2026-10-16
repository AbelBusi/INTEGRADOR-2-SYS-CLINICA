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
        Integer estado,
        Integer idRegistro
) {

    public UsuarioListadoDTO(
            Integer id,
            String persona,
            String nombreUsuario,
            String rol,
            LocalDateTime fechaCreacion,
            LocalDateTime fechaActualizacion,
            boolean requiereCambioClave,
            Integer estado
    ) {
        this(id, persona, nombreUsuario, rol, fechaCreacion, fechaActualizacion,
                requiereCambioClave, estado, null);
    }

}