package com.salud.consultorio.service;

import com.salud.consultorio.dto.rol.RolRespuestaDTO;

import java.util.List;

public interface IRolServicio {

    List<RolRespuestaDTO> leerTodos();

    boolean existeRolId(Integer id);

}