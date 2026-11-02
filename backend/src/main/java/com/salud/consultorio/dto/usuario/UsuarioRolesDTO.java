package com.salud.consultorio.dto.usuario;

import com.salud.consultorio.auth.dto.rol.RolResumenDTO;

import java.util.List;

public record UsuarioRolesDTO(
        Integer id,
        String usuario,
        String nombreCompleto,
        List<RolResumenDTO> roles
) {
}