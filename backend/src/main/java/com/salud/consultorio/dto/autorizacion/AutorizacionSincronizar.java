package com.salud.consultorio.dto.autorizacion;

import java.util.List;

public record AutorizacionSincronizar(
        Integer idRol,
        List<Integer> idPermisos
) {
}
