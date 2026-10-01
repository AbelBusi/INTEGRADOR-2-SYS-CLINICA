package com.salud.consultorio.dto.paciente;

import com.salud.consultorio.dto.persona.PersonaActualizarDTO;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Schema(description = "DTO para actualizar información de un paciente")
public record PacienteActualizarDTO (

    @NotBlank(message = "El código aseguradora es obligatorio")
    @Size(max = 20, message = "El código aseguradora no debe exceder 20 caracteres")
    @Schema(
            description = "Código de aseguradora del paciente",
            example = "PAC-2026-001"
    )
    String codigoAsegurado,

    @Valid
    @NotNull(message = "La persona es obligatoria")
    @Schema(description = "Información personal actualizada del paciente")
    PersonaActualizarDTO persona

){}
