package com.salud.consultorio.dto.paciente;

import com.salud.consultorio.dto.persona.PersonaRespuestaDTO;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "DTO de respuesta de información del paciente")
public record PacienteRespuestaDTO(

        @Schema(
                description = "Identificador único del paciente",
                example = "1"
        )
        Integer id,

        @Schema(
                description = "Entidad aseguradora del paciente",
                example = "RIMAC"
        )
        String entidadAsegurado,

        @Schema(
                description = "Código de aseguradora del paciente",
                example = "RIM-2026-001"
        )
        String codigoAsegurado,

        @Schema(
                description = "Estado actual del paciente",
                example = "1"
        )
        Integer estado,

        @Schema(description = "Información personal del paciente")
        PersonaRespuestaDTO persona

) {
}