package com.salud.consultorio.dto.historiaClinica;

import com.salud.consultorio.model.enums.EntidadAuditoriaHC;
import com.salud.consultorio.model.enums.OperacionAuditoriaHC;

import java.time.LocalDateTime;
import java.util.Map;

public record AuditoriaHistoriaClinicaRespuestaDTO(
        Integer id, EntidadAuditoriaHC entidad, Integer idRegistro, OperacionAuditoriaHC operacion,
        String usuario, LocalDateTime fechaEvento,
        Map<String, Object> datosAnteriores, Map<String, Object> datosNuevos
) {}