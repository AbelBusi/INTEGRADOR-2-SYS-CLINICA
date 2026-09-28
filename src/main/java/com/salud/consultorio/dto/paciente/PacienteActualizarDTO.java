package com.salud.consultorio.dto.paciente;

import com.salud.consultorio.dto.persona.PersonaActualizarDTO;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Schema(description = "DTO para actualizar información de un paciente")
public class PacienteActualizarDTO {

    @NotBlank(message = "La entidad aseguradora es obligatoria")
    @Size(max = 8, message = "La entidad aseguradora no debe exceder 8 caracteres")
    @Schema(
            description = "Entidad aseguradora del paciente",
            example = "PACIFICO"
    )
    private String entidadAseguradora;

    @NotBlank(message = "El código aseguradora es obligatorio")
    @Size(max = 20, message = "El código aseguradora no debe exceder 20 caracteres")
    @Schema(
            description = "Código de aseguradora del paciente",
            example = "PAC-2026-001"
    )
    private String codigoAseguradora;

    @Schema(
            description = "Estado actual del paciente",
            example = "1"
    )
    private Integer estado;

    @Valid
    @NotNull(message = "La persona es obligatoria")
    @Schema(description = "Información personal actualizada del paciente")
    private PersonaActualizarDTO persona;

}