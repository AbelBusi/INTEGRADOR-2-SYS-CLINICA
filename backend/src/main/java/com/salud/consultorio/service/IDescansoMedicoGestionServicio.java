package com.salud.consultorio.service;

import com.salud.consultorio.dto.descansoMedico.DescansoMedicoCancelarDTO;
import com.salud.consultorio.dto.descansoMedico.DescansoMedicoHistorialDTO;
import com.salud.consultorio.dto.descansoMedico.DescansoMedicoRespuestaDTO;

import java.util.List;

public interface IDescansoMedicoGestionServicio {

    List<DescansoMedicoRespuestaDTO> listarMisDocumentos();

    DescansoMedicoHistorialDTO historial(Integer idDescanso);

    DescansoMedicoRespuestaDTO cancelar(Integer idDescanso, DescansoMedicoCancelarDTO dto, String ipOrigen);
}