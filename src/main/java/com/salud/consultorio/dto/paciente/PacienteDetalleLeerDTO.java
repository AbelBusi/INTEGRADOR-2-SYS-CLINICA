package com.salud.consultorio.dto.paciente;

import com.salud.consultorio.dto.persona.PersonaLeerDTO;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@NoArgsConstructor
@Getter
@Setter
@Schema(description = "DTO de lectura detallada de pacientes")
public class PacienteDetalleLeerDTO {

    @Schema(
            description = "Identificador único del paciente",
            example = "1"
    )
    private Integer id;

    @Schema(description = "Información personal del paciente")
    private PersonaLeerDTO persona;

    @Schema(
            description = "Entidad aseguradora del paciente",
            example = "MAPFRE"
    )
    private String entidadAseguradora;

    @Schema(
            description = "Código de aseguradora del paciente",
            example = "MAP-2026-001"
    )
    private String codigoAseguradora;

    @Schema(
            description = "Estado actual del paciente",
            example = "1"
    )
    private Integer estado;

    public PacienteDetalleLeerDTO(
            Integer id,
            PersonaLeerDTO persona,
            String entidadAseguradora,
            String codigoAseguradora,
            Integer estado
    ) {
        this.id = id;
        this.persona = persona;
        this.entidadAseguradora = entidadAseguradora;
        this.codigoAseguradora = codigoAseguradora;
        this.estado = estado;
    }
}