package com.salud.consultorio.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.salud.consultorio.auth.UsuarioAutenticadoProvider;
import com.salud.consultorio.model.entity.AuditoriaHistoriaClinica;
import com.salud.consultorio.model.entity.HistoriaClinica;
import com.salud.consultorio.model.enums.EntidadAuditoriaHC;
import com.salud.consultorio.model.enums.OperacionAuditoriaHC;
import com.salud.consultorio.repository.IAuditoriaHistoriaClinicaRepositorio;
import com.salud.consultorio.service.IAuditoriaHistoriaClinicaServicio;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.LocalDateTime;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuditoriaHistoriaClinicaServicioImpl implements IAuditoriaHistoriaClinicaServicio {

    private final IAuditoriaHistoriaClinicaRepositorio auditoriaRepositorio;
    private final UsuarioAutenticadoProvider usuarioAutenticadoProvider;
    private final ObjectMapper objectMapper;
    private final Clock clock;

    // MANDATORY: la auditoría solo se guarda dentro de la transacción del cambio clínico
    @Transactional(propagation = Propagation.MANDATORY)
    @Override
    public void registrar(HistoriaClinica historia, EntidadAuditoriaHC entidad, Integer idRegistro,
                          OperacionAuditoriaHC operacion,
                          Map<String, Object> datosAnteriores, Map<String, Object> datosNuevos) {

        AuditoriaHistoriaClinica evento = AuditoriaHistoriaClinica.builder()
                .historiaClinica(historia)
                .entidad(entidad)
                .idRegistro(idRegistro)
                .operacion(operacion)
                .usuario(usuarioAutenticadoProvider.obtener())
                .fechaEvento(LocalDateTime.now(clock))
                .datosAnteriores(serializar(datosAnteriores))
                .datosNuevos(serializar(datosNuevos))
                .build();

        auditoriaRepositorio.save(evento);

    }

    private String serializar(Map<String, Object> datos) {

        if (datos == null || datos.isEmpty()) {
            return null;
        }

        try {
            return objectMapper.writeValueAsString(datos);
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("No se pudo serializar los datos de auditoría.", e);
        }

    }

}