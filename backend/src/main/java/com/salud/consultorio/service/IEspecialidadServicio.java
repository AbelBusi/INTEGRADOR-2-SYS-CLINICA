package com.salud.consultorio.service;


import com.salud.consultorio.dto.especialidad.*;
import com.salud.consultorio.model.enums.EntidadEstado;

import java.util.List;

public interface IEspecialidadServicio{


    List<EspecialidadRespuestaDTO> lista(EntidadEstado estado);

    EspecialidadRespuestaDTO entidadPorID(Integer id);

    EspecialidadRespuestaDTO crear(EspecialidadCrearDTO dto);

    EspecialidadRespuestaDTO actualizar(EspecialidadActualizarDTO dto, Integer id);

    void eliminarPorId(Integer id);

    void cambiarEstado(Integer id, EntidadEstado estado);

    boolean existeEspecialidadNombre(String nombre);

}