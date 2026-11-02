package com.salud.consultorio.dto.examenSolicitado;

import java.time.LocalDateTime;

public record ExamenSolicitadoRespuestaDTO(
        Integer id,
        Integer idDiagnostico,
        String nombreExamen,
        String tipoExamen,
        String motivo,
        String indicaciones,
        String prioridad,
        Boolean requiereAyuno,
        LocalDateTime fechaSolicitud,
        String observacion
) {
}