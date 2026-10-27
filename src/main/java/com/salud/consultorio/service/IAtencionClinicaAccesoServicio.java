package com.salud.consultorio.service;

import com.salud.consultorio.model.entity.CitaMedica;
import com.salud.consultorio.model.entity.Diagnostico;

public interface IAtencionClinicaAccesoServicio {

    CitaMedica citaParaEscritura(Integer idCita);

    CitaMedica citaParaLectura(Integer idCita);

    Diagnostico diagnosticoParaEscritura(Integer idDiagnostico);

    Diagnostico diagnosticoParaLectura(Integer idDiagnostico);

}