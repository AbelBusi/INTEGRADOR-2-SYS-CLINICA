package com.salud.consultorio.service;

import com.salud.consultorio.auth.dto.rol.*;
import com.salud.consultorio.model.enums.EntidadEstado;

import java.util.List;

public interface IRolServicio {

    List<RolRespuestaDTO> leerTodos(EntidadEstado estado);

    boolean existeRolId(Integer id);

    IRolRespuestaDTO crear(RolCrearDTO dto);

    IRolRespuestaDTO actualizar(RolActualizarDTO dto, Integer id);

    List<RolResumenDTO> listaResumen();

    void eliminarPorId(Integer id);

    void cambiarEstado(Integer id, EntidadEstado estado);

    boolean existeRolNombre(String nombre);

    IRolRespuestaDTO entidadPorID(Integer id);

}