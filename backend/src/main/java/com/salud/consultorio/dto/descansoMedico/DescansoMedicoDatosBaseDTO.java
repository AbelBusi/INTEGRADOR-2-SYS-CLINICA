package com.salud.consultorio.dto.descansoMedico;

import java.time.LocalDate;

public record DescansoMedicoDatosBaseDTO(
        String pacienteNombre,
        String pacienteDocumento,
        String medicoNombre,
        String especialidad,
        String numeroColegiatura,
        LocalDate fechaAtencion
) {
}