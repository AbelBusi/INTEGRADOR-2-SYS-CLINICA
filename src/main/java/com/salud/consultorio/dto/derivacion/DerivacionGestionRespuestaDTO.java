package com.salud.consultorio.dto.derivacion;

import java.time.LocalDateTime;

public record DerivacionGestionRespuestaDTO(
        Integer id,
        String codigo,
        Integer idDiagnostico,
        String codigoDiagnostico,
        Integer idPaciente,
        String pacienteNombre,
        String pacienteDocumento,
        Integer idEspecialidad,
        String especialidadNombre,
        String medicoSolicitante,
        LocalDateTime fechaDerivacion,
        Integer urgencia,
        Integer estado,
        String motivo,
        Integer idCitaMedica
) {
}