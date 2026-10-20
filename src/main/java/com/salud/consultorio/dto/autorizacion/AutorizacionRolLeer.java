package com.salud.consultorio.dto.autorizacion;

import java.util.List;

public record AutorizacionRolLeer(

        String rol,
        List<PermisosRolLeer> permisos

) {
}