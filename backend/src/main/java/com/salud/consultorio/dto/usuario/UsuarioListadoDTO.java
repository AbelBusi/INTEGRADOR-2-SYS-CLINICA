package com.salud.consultorio.dto.usuario;

import com.salud.consultorio.auth.dto.rol.RolResumenDTO;

import java.util.List;

public record UsuarioListadoDTO(
        Integer id,
        String usuario,
        String nombreCompleto,
        String numeroDocumento,
        Integer estado,
        List<RolResumenDTO> roles
) {
}