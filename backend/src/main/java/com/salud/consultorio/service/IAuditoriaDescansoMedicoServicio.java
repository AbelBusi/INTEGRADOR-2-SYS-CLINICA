package com.salud.consultorio.service;

import com.salud.consultorio.dto.descansoMedico.DescansoMedicoCrearDTO;
import com.salud.consultorio.model.entity.CancelacionDescansoMedico;
import com.salud.consultorio.model.entity.CitaMedica;
import com.salud.consultorio.model.entity.DescansoMedico;
import com.salud.consultorio.model.entity.Usuario;

public interface IAuditoriaDescansoMedicoServicio {

    void registrarEmision(DescansoMedico descanso, String ipOrigen);

    void registrarCodigoInvalido(CitaMedica cita, Usuario usuario, DescansoMedicoCrearDTO dto, String ipOrigen);

    void registrarCancelacion(CancelacionDescansoMedico cancelacion, String ipOrigen);

    void registrarCodigoInvalidoCancelacion(DescansoMedico descanso, Usuario usuario, String ipOrigen);
}