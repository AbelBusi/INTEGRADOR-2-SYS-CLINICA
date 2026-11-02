package com.salud.consultorio.service;

import com.salud.consultorio.dto.autorizacion.*;

public interface IAutorizacionServicio {

    AutorizacionRespuesta crear(AutorizacionCrear dto);

    AutorizacionRolLeer listarPermisosPorRol(Integer idRol);

    PermisosModulosLeer listarPermisos();

    AutorizacionRespuesta sincronizar(AutorizacionSincronizar dto);

}