package com.salud.consultorio.service;

import com.salud.consultorio.dto.diagnostico.DiagnosticoCrearDTO;
import com.salud.consultorio.dto.diagnostico.DiagnosticoRespuestaDTO;

import java.util.List;

public interface IDiagnosticoServicio {

    DiagnosticoRespuestaDTO crear(Integer idCita, DiagnosticoCrearDTO dto);

    List<DiagnosticoRespuestaDTO> listaPorCita(Integer idCita);

    DiagnosticoRespuestaDTO entidadPorID(Integer idDiagnostico);

}