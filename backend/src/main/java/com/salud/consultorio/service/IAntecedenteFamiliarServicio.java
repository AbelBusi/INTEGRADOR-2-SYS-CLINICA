package com.salud.consultorio.service;

import com.salud.consultorio.dto.historiaClinica.AntecedenteFamiliarActualizarDTO;
import com.salud.consultorio.dto.historiaClinica.AntecedenteFamiliarCrearDTO;
import com.salud.consultorio.dto.historiaClinica.AntecedenteFamiliarRespuestaDTO;

public interface IAntecedenteFamiliarServicio {
    AntecedenteFamiliarRespuestaDTO crear(Integer idHistoria, AntecedenteFamiliarCrearDTO dto);
    AntecedenteFamiliarRespuestaDTO actualizar(Integer idHistoria, Integer id, AntecedenteFamiliarActualizarDTO dto);
    void eliminar(Integer idHistoria, Integer id);
}
