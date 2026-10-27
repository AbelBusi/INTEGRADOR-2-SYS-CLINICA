package com.salud.consultorio.service;

import com.salud.consultorio.dto.examenSolicitado.ExamenSolicitadoCrearDTO;
import com.salud.consultorio.dto.examenSolicitado.ExamenSolicitadoRespuestaDTO;

import java.util.List;

public interface IExamenSolicitadoServicio {

    ExamenSolicitadoRespuestaDTO crear(Integer idDiagnostico, ExamenSolicitadoCrearDTO dto);

    List<ExamenSolicitadoRespuestaDTO> listaPorDiagnostico(Integer idDiagnostico);

}