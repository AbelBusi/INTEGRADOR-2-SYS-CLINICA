package com.salud.consultorio.dto.medicamento;

import com.salud.consultorio.model.enums.GrupoTerapeutico;

/** Medicamento ya registrado con un nombre parecido al que se está escribiendo. */
public record MedicamentoSimilarDTO(
        Integer id,
        String nombre,
        String concentracion,
        GrupoTerapeutico grupoTerapeutico,
        Integer estado
) {
}