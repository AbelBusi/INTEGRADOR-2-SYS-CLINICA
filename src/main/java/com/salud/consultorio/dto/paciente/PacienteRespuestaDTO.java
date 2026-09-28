package com.salud.consultorio.dto.paciente;

import com.salud.consultorio.dto.persona.PersonaRespuestaDTO;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder(toBuilder = true)
@Schema(description = "DTO de respuesta de información del paciente")
public class PacienteRespuestaDTO {

    @Schema(
            description = "Identificador único del paciente",
            example = "1"
    )
    private Integer id;

    @Schema(
            description = "Entidad aseguradora del paciente",
            example = "RIMAC"
    )
    private String entidadAseguradora;

    @Schema(
            description = "Código de aseguradora del paciente",
            example = "RIM-2026-001"
    )
    private String codigoAseguradora;

    @Schema(
            description = "Estado actual del paciente",
            example = "1"
    )
    private Integer estado;

    @Schema(description = "Información personal del paciente")
    private PersonaRespuestaDTO persona;

}