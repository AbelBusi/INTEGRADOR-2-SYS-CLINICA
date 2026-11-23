package com.salud.consultorio.service;

import com.salud.consultorio.dto.historiaClinica.HistoriaClinicaActualizarDTO;
import com.salud.consultorio.dto.historiaClinica.HistoriaClinicaCrearDTO;
import com.salud.consultorio.dto.historiaClinica.HistoriaClinicaRespuestaDTO;
import com.salud.consultorio.dto.historiaClinica.HistoriaClinicaResumenDTO;

import java.util.List;

public interface IHistoriaClinicaServicio {
    HistoriaClinicaRespuestaDTO obtenerPorPaciente(Integer idPaciente);
    HistoriaClinicaRespuestaDTO obtenerMiHistoria();
    HistoriaClinicaRespuestaDTO crear(HistoriaClinicaCrearDTO dto);
    HistoriaClinicaRespuestaDTO actualizar(Integer idHistoria, HistoriaClinicaActualizarDTO dto);
    List<HistoriaClinicaResumenDTO> listar();
}