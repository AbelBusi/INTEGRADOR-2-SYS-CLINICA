package com.salud.consultorio.dto.indicacion;

public record IndicacionRespuestaDTO(
        Integer id,
        Integer idDiagnostico,
        String tipoIndicacion,
        String descripcion,
        Integer diasReposo,
        String frecuencia,
        Integer estado
) {
}