package com.salud.consultorio.service;

import com.salud.consultorio.dto.historiaClinica.AuditoriaHistoriaClinicaRespuestaDTO;
import com.salud.consultorio.dto.historiaClinica.PaginaDTO;
import com.salud.consultorio.model.entity.HistoriaClinica;
import com.salud.consultorio.model.enums.EntidadAuditoriaHC;
import com.salud.consultorio.model.enums.OperacionAuditoriaHC;

import java.util.Map;

public interface IAuditoriaHistoriaClinicaServicio {

    void registrar(HistoriaClinica historia, EntidadAuditoriaHC entidad, Integer idRegistro,
                   OperacionAuditoriaHC operacion,
                   Map<String, Object> datosAnteriores, Map<String, Object> datosNuevos);

    PaginaDTO<AuditoriaHistoriaClinicaRespuestaDTO> listarPorHistoria(Integer idHistoria, int pagina, int tamanio);

    PaginaDTO<AuditoriaHistoriaClinicaRespuestaDTO> listarMias(int pagina, int tamanio);

}