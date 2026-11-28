package com.salud.consultorio.dto.medicamento;

import com.salud.consultorio.model.enums.GrupoTerapeutico;
import com.salud.consultorio.model.enums.IndicacionTerapeutica;

import java.time.LocalDateTime;

public record MedicamentoRespuestaDTO(
        Integer id,
        String nombre,
        String principioActivo,
        String concentracion,
        GrupoTerapeutico grupoTerapeutico,
        IndicacionTerapeutica indicacionTerapeutica,
        String laboratorio,
        String descripcion,
        Boolean requiereReceta,
        String foto,
        Integer estado,
        LocalDateTime fechaCreacion,
        LocalDateTime fechaActualizacion
) {
}