package com.salud.consultorio.dto.paciente;

import com.salud.consultorio.dto.persona.PersonaCrearDTO;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

@Schema(description = "DTO para registrar un paciente")
public record PacienteCrearDTO (

    @NotBlank(message = "La entidad aseguradora es obligatoria")
    @Size(max = 8, message = "La entidad aseguradora no debe exceder 8 caracteres")
    @Schema(
            description = "Entidad aseguradora del paciente",
            example = "ESSALUD"
    )
    String entidadAsegurado,

    @NotBlank(message = "El código aseguradora es obligatorio")
    @Size(max = 20, message = "El código aseguradora no debe exceder 20 caracteres")
    @Schema(
            description = "Código de aseguradora del paciente",
            example = "ASEG-2026-001"
    )
    String codigoAsegurado,

    @Valid
    @NotNull(message = "La persona es obligatoria")
    @Schema(description = "Información personal del paciente")
    PersonaCrearDTO persona
){}