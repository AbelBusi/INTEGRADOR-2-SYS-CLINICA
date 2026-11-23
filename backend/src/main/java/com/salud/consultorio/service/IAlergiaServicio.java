package com.salud.consultorio.service;

import com.salud.consultorio.dto.historiaClinica.AlergiaActualizarDTO;
import com.salud.consultorio.dto.historiaClinica.AlergiaCrearDTO;
import com.salud.consultorio.dto.historiaClinica.AlergiaRespuestaDTO;

public interface IAlergiaServicio {
    AlergiaRespuestaDTO crear(Integer idHistoria, AlergiaCrearDTO dto);
    AlergiaRespuestaDTO actualizar(Integer idHistoria, Integer id, AlergiaActualizarDTO dto);
    void eliminar(Integer idHistoria, Integer id);
}