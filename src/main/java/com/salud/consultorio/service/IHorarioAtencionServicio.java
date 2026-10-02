package com.salud.consultorio.service;

import com.salud.consultorio.dto.horarioAtencion.HorarioAtencionRespuesta;
import com.salud.consultorio.dto.horarioAtencion.HorarioCrearDTO;

public interface IHorarioAtencionServicio {

    HorarioAtencionRespuesta crear(HorarioCrearDTO dto);

}