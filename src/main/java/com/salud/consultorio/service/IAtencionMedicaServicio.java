package com.salud.consultorio.service;

import com.salud.consultorio.dto.atencion.AtencionCrearDTO;
import com.salud.consultorio.dto.atencion.AtencionLeerDTO;

import java.util.List;

public interface IAtencionMedicaServicio {

    void atenderCita(Integer citaId, String usuario, AtencionCrearDTO dto);

    List<AtencionLeerDTO> historiaPorPaciente(Integer pacienteId);

    List<AtencionLeerDTO> historiaPorUsuario(String usuario);

}
