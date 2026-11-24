package com.salud.consultorio.service;

import com.salud.consultorio.dto.descansoMedico.DescansoMedicoContextoDTO;
import com.salud.consultorio.dto.descansoMedico.DescansoMedicoCrearDTO;
import com.salud.consultorio.dto.descansoMedico.DescansoMedicoRespuestaDTO;

public interface IDescansoMedicoServicio {

    DescansoMedicoContextoDTO contexto(Integer idCita);

    DescansoMedicoRespuestaDTO emitir(Integer idCita, DescansoMedicoCrearDTO dto, String ipOrigen);
}