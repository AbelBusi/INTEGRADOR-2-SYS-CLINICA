package com.salud.consultorio.service;

import com.salud.consultorio.dto.citaMedica.CitaMedicaCrearDTO;
import com.salud.consultorio.dto.citaMedica.CitaMedicaRespuestaDTO;
import com.salud.consultorio.dto.derivacion.DerivacionGestionRespuestaDTO;

public interface IDerivacionGestionServicio {

    DerivacionGestionRespuestaDTO buscarPorCodigo(String codigo);

    CitaMedicaRespuestaDTO programarCita(Integer idDerivacion, CitaMedicaCrearDTO dto);

}