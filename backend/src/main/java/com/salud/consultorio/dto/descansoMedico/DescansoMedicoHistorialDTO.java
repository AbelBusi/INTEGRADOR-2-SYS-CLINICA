package com.salud.consultorio.dto.descansoMedico;

import java.util.List;

public record DescansoMedicoHistorialDTO(
        DescansoMedicoRespuestaDTO descanso,
        List<AuditoriaDescansoMedicoDTO> eventos
) {
}