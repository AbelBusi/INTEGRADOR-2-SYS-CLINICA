package com.salud.consultorio.dto.historialCita;

import java.time.LocalDateTime;
import java.util.Map;

public record HistorialCitaRespuestaDTO(
        Integer id,
        Integer idCita,
        String accion,
        LocalDateTime fechaEvento,
        Integer idUsuario,
        String usuario,
        String nombreUsuario,
        String observacion,
        Map<String, Object> datosAnteriores,
        Map<String, Object> datosNuevos
) {}