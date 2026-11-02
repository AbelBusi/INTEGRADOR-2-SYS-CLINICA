package com.salud.consultorio.service;

import com.salud.consultorio.dto.examenSolicitado.ExamenSolicitadoActualizarDTO;
import com.salud.consultorio.dto.examenSolicitado.ExamenSolicitadoCrearDTO;
import com.salud.consultorio.dto.examenSolicitado.ExamenSolicitadoRespuestaDTO;

import java.util.List;

public interface IExamenSolicitadoServicio {

    ExamenSolicitadoRespuestaDTO crear(Integer idDiagnostico, ExamenSolicitadoCrearDTO dto);

    List<ExamenSolicitadoRespuestaDTO> listaPorDiagnostico(Integer idDiagnostico);

    ExamenSolicitadoRespuestaDTO actualizar(Integer idDiagnostico, Integer idExamen, ExamenSolicitadoActualizarDTO dto);

    void eliminar(Integer idDiagnostico, Integer idExamen);

}