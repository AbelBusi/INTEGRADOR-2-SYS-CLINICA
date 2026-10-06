package com.salud.consultorio.service;

import com.salud.consultorio.dto.horarioAtencion.EmpleadoHorarioRespuesta;
import com.salud.consultorio.dto.horarioAtencion.HorarioAtencionRespuesta;
import com.salud.consultorio.dto.horarioAtencion.HorarioAtencionResumenDTO;
import com.salud.consultorio.dto.horarioAtencion.HorarioCrearDTO;
import com.salud.consultorio.model.entity.HorarioAtencion;

import java.util.List;

public interface IHorarioAtencionServicio {

    HorarioAtencionRespuesta crear(HorarioCrearDTO dto);

    EmpleadoHorarioRespuesta obtenerPorID(Integer id);

    List<HorarioAtencionResumenDTO> lista();

}