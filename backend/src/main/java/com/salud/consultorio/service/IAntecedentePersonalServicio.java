package com.salud.consultorio.service;

import com.salud.consultorio.dto.historiaClinica.AntecedentePersonalActualizarDTO;
import com.salud.consultorio.dto.historiaClinica.AntecedentePersonalCrearDTO;
import com.salud.consultorio.dto.historiaClinica.AntecedentePersonalRespuestaDTO;

public interface IAntecedentePersonalServicio {
    AntecedentePersonalRespuestaDTO crear(Integer idHistoria, AntecedentePersonalCrearDTO dto);
    AntecedentePersonalRespuestaDTO actualizar(Integer idHistoria, Integer id, AntecedentePersonalActualizarDTO dto);
    void eliminar(Integer idHistoria, Integer id);
}
