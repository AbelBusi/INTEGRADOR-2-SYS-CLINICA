package com.salud.consultorio.service;

import com.salud.consultorio.dto.derivacion.DerivacionActualizarDTO;
import com.salud.consultorio.dto.derivacion.DerivacionCrearDTO;
import com.salud.consultorio.dto.derivacion.DerivacionRespuestaDTO;

import java.util.List;

public interface IDerivacionServicio {

    DerivacionRespuestaDTO crear(Integer idDiagnostico, DerivacionCrearDTO dto);

    List<DerivacionRespuestaDTO> listaPorDiagnostico(Integer idDiagnostico);

    DerivacionRespuestaDTO actualizar(Integer idDiagnostico, Integer idDerivacion, DerivacionActualizarDTO dto);

    void eliminar(Integer idDiagnostico, Integer idDerivacion);

}