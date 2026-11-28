package com.salud.consultorio.service;

import com.salud.consultorio.dto.descansoMedico.DescansoMedicoVerificacionDTO;

public interface IDescansoMedicoVerificacionServicio {

    DescansoMedicoVerificacionDTO verificar(String codigoDocumento);
}