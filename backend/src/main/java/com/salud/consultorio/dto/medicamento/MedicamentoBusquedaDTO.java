package com.salud.consultorio.dto.medicamento;

import com.salud.consultorio.model.enums.GrupoTerapeutico;

/** Resultado liviano del buscador de medicamentos (lo usa Tratamiento para elegir del catálogo). */
public record MedicamentoBusquedaDTO(
        Integer id,
        String nombre,
        String concentracion,
        String principioActivo,
        GrupoTerapeutico grupoTerapeutico,
        Boolean requiereReceta,
        String foto
) {
}
