package com.salud.consultorio.service;

import com.salud.consultorio.dto.indicacion.IndicacionCrearDTO;
import com.salud.consultorio.dto.indicacion.IndicacionRespuestaDTO;

import java.util.List;

public interface IIndicacionServicio {

    IndicacionRespuestaDTO crear(Integer idDiagnostico, IndicacionCrearDTO dto);

    List<IndicacionRespuestaDTO> listaPorDiagnostico(Integer idDiagnostico);

}