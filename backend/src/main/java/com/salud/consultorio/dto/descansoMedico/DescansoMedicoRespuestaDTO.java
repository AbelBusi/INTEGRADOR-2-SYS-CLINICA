package com.salud.consultorio.dto.descansoMedico;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record DescansoMedicoRespuestaDTO(
        Integer id,
        String numero,
        String codigoDocumento,
        DescansoMedicoDatosBaseDTO datos,
        LocalDate fechaInicio,
        LocalDate fechaFin,
        Integer dias,
        String justificacion,
        LocalDateTime fechaEmision,
        String metodoConfirmacion,
        LocalDateTime fechaConfirmacion,
        String tipoFirma,
        String algoritmoFirma,
        String firma,
        String hashContenido
) {
}