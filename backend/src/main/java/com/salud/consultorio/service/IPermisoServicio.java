package com.salud.consultorio.service;

import com.salud.consultorio.auth.dto.rol.RolRespuestaDTO;

import java.util.List;

public interface IPermisoServicio {

    List<RolRespuestaDTO> listaPermisosPorRolId(Integer id);

}