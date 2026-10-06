package com.salud.consultorio.service;

import com.salud.consultorio.dto.horarioAtencion.*;
import com.salud.consultorio.model.entity.HorarioAtencion;

import java.util.List;

public interface IHorarioAtencionServicio {

    HorarioAtencionRespuesta crear(HorarioCrearDTO dto);

    EmpleadoHorarioRespuesta obtenerPorID(Integer id);

    List<HorarioAtencionResumenDTO> lista();

    HorarioAtencionRespuestaDTO actualizar(Integer idHorario, HorarioActualizarDTO dto);

    void eliminarPorId(Integer idHorario);

}