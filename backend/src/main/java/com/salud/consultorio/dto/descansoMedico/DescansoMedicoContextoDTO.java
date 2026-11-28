package com.salud.consultorio.dto.descansoMedico;

import java.time.LocalDateTime;

public record DescansoMedicoContextoDTO(
        DescansoMedicoRespuestaDTO descanso,
        DescansoMedicoDatosBaseDTO datos,
        boolean puedeEmitir,
        String motivoBloqueo,
        String codigoBloqueo,
        LocalDateTime venceEmision
) {
}