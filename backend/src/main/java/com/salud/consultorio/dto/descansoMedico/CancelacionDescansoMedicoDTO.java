package com.salud.consultorio.dto.descansoMedico;

import java.time.LocalDateTime;

public record CancelacionDescansoMedicoDTO(
        LocalDateTime fechaCancelacion,
        String motivo,
        String canceladoPor
) {
}