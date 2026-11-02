package com.salud.consultorio.dto.diagnostico;

import java.time.LocalDateTime;

public record DiagnosticoRespuestaDTO(
        Integer id,
        Integer idCitaMedica,
        String codigo,
        String descripcion,
        Integer tipoDiagnostico,
        String observaciones,
        LocalDateTime fecDiagnostico,
        Integer estado
) {
}