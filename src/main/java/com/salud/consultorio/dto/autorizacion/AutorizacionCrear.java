package com.salud.consultorio.dto.autorizacion;

import java.util.List;

public record AutorizacionCrear(

        Integer idRol,
        List<AgregarPermiso> permisos

) {
}