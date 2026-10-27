package com.salud.consultorio.dto.atencionClinica;

import com.salud.consultorio.dto.citaMedica.CitaMedicaRespuestaDTO;

import java.util.List;

public record AtencionClinicaRespuestaDTO(
        CitaMedicaRespuestaDTO cita,
        List<DiagnosticoDetalleDTO> diagnosticos
) {
}