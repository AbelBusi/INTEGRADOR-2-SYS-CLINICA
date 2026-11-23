package com.salud.consultorio.service;

import com.salud.consultorio.model.entity.HistoriaClinica;
import com.salud.consultorio.model.entity.Medico;
import com.salud.consultorio.model.entity.Paciente;

public interface IHistoriaClinicaAccesoServicio {

    Paciente pacienteTitular();

    Medico medicoAutorizadoPara(Integer idPaciente);

    HistoriaClinica historiaParaEscritura(Integer idHistoria);

    Medico medicoAutenticado();
}