package com.salud.consultorio.service;

import com.salud.consultorio.model.entity.Permiso;

import java.util.List;

public interface IPermisoServicio {

    List<Permiso> traerPermisosExistentesPorID(List<Integer> idsPermisos);


}