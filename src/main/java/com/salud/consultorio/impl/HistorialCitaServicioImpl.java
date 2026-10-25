package com.salud.consultorio.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.salud.consultorio.auth.UsuarioAutenticadoProvider;
import com.salud.consultorio.dto.historialCita.HistorialCitaRespuestaDTO;
import com.salud.consultorio.model.entity.CitaMedica;
import com.salud.consultorio.model.entity.HistorialCita;
import com.salud.consultorio.model.enums.AccionHistorialCita;
import com.salud.consultorio.repository.ICitaMedicaRepositorio;
import com.salud.consultorio.repository.IHistorialCitaRepositorio;
import com.salud.consultorio.service.IHistorialCitaServicio;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class HistorialCitaServicioImpl implements IHistorialCitaServicio {

    private static final TypeReference<Map<String, Object>> TIPO_MAPA = new TypeReference<>() {};

    private final IHistorialCitaRepositorio historialCitaRepositorio;
    private final ICitaMedicaRepositorio citaMedicaRepositorio;
    private final ObjectMapper objectMapper;
    private final UsuarioAutenticadoProvider usuarioAutenticadoProvider;

    @Transactional(propagation = Propagation.MANDATORY)
    @Override
    public void registrar(CitaMedica cita, AccionHistorialCita accion,
                          Map<String, Object> datosAnteriores,
                          Map<String, Object> datosNuevos,
                          String observacion) {

        if (cita == null || cita.getId() == null || !citaMedicaRepositorio.existsById(cita.getId())) {
            throw new EntityNotFoundException("No existe la cita médica para registrar el historial");
        }

        HistorialCita evento = HistorialCita.builder()
                .cita(cita)
                .usuario(usuarioAutenticadoProvider.obtener())
                .accion(accion)
                .fechaEvento(LocalDateTime.now())
                .datosAnteriores(serializar(datosAnteriores))
                .datosNuevos(serializar(datosNuevos))
                .observacion(observacion)
                .build();

        historialCitaRepositorio.save(evento);

    }

    @Transactional(readOnly = true)
    @Override
    public List<HistorialCitaRespuestaDTO> listaPorCita(Integer idCita) {

        if (!citaMedicaRepositorio.existsById(idCita)) {
            throw new EntityNotFoundException("No existe la cita médica");
        }

        return historialCitaRepositorio.listaPorCita(idCita).stream()
                .map(this::toDto)
                .toList();

    }

    private String serializar(Map<String, Object> datos) {

        if (datos == null || datos.isEmpty()) {
            return null;
        }

        try {
            return objectMapper.writeValueAsString(datos);
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("No se pudo serializar los datos del historial.", e);
        }

    }

    private Map<String, Object> deserializar(String json) {

        if (json == null || json.isBlank()) {
            return null;
        }

        try {
            return objectMapper.readValue(json, TIPO_MAPA);
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("No se pudo leer los datos del historial.", e);
        }

    }

    private HistorialCitaRespuestaDTO toDto(HistorialCita h) {

        var persona = h.getUsuario().getPersona();

        return new HistorialCitaRespuestaDTO(
                h.getId(),
                h.getCita().getId(),
                h.getAccion().name(),
                h.getFechaEvento(),
                h.getUsuario().getId(),
                h.getUsuario().getUsuario(),
                persona.getNombre() + " " + persona.getApellidos(),
                h.getObservacion(),
                deserializar(h.getDatosAnteriores()),
                deserializar(h.getDatosNuevos())
        );

    }

}