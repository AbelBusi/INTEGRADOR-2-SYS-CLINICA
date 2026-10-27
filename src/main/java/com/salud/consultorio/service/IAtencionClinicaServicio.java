package com.salud.consultorio.service;

import com.salud.consultorio.dto.atencionClinica.AtencionClinicaRespuestaDTO;

public interface IAtencionClinicaServicio {

    AtencionClinicaRespuestaDTO detallePorCita(Integer idCita);

}