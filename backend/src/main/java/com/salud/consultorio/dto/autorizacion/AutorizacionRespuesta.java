package com.salud.consultorio.dto.autorizacion;

import java.util.List;

public record AutorizacionRespuesta(

        Integer idRol,
        List<AgregarPermiso> permisos

) {
}
