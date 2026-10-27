package com.salud.consultorio.dto.examenSolicitado;

public record ExamenSolicitadoRespuestaDTO(
        Integer id,
        Integer idDiagnostico,
        String motivo,
        Integer estado
) {
}