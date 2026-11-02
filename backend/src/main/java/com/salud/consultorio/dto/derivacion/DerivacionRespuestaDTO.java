package com.salud.consultorio.dto.derivacion;

public record DerivacionRespuestaDTO(
        Integer id,
        Integer idDiagnostico,
        String codigo,
        Integer idEspecialidad,
        String nombreEspecialidad,
        String motivo,
        Integer urgencia,
        Integer estado
) {
}