package com.salud.consultorio.dto.descansoMedico;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record DescansoMedicoVerificacionDTO(
        String estado,
        String numero,
        LocalDateTime fechaEmision,
        LocalDate fechaInicio,
        LocalDate fechaFin,
        Integer dias,
        String medicoNombre,
        String medicoEspecialidad,
        String medicoColegiatura,
        String pacienteNombre,
        String pacienteDocumento,
        String hashContenido,
        String tipoFirma,
        boolean firmaIntegra,
        LocalDateTime fechaCancelacion
) {
}