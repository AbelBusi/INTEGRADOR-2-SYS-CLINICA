package com.salud.consultorio.dto.descansoMedico;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record AuditoriaDescansoMedicoDTO(
        Integer id,
        String resultado,
        LocalDateTime fechaEvento,
        String realizadoPor,
        String ipOrigen,
        String codigoDocumento,
        String hashContenido,
        LocalDate fechaInicio,
        LocalDate fechaFin,
        Integer dias,
        String justificacion,
        String observacion
) {
}