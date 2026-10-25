package com.salud.consultorio.service;

import com.salud.consultorio.dto.historialCita.HistorialCitaRespuestaDTO;
import com.salud.consultorio.model.entity.CitaMedica;
import com.salud.consultorio.model.enums.AccionHistorialCita;

import java.util.List;
import java.util.Map;

public interface IHistorialCitaServicio {

    void registrar(CitaMedica cita, AccionHistorialCita accion,
                   Map<String, Object> datosAnteriores,
                   Map<String, Object> datosNuevos,
                   String observacion);

    List<HistorialCitaRespuestaDTO> listaPorCita(Integer idCita);

}
