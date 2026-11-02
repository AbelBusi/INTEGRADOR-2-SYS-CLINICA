package com.salud.consultorio.dto.autorizacion;

import java.util.List;

public record PermisosRolLeer(

        String modulo,
        List<PermisosLeer> permisos
) {
}