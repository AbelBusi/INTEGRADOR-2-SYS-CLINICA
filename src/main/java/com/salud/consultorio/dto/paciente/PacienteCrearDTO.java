package com.salud.consultorio.dto.paciente;

import com.salud.consultorio.dto.persona.PersonaCrearDTO;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Schema(description = "DTO para registrar un paciente")
public class PacienteCrearDTO {

    @NotBlank(message = "La entidad aseguradora es obligatoria")
    @Size(max = 8, message = "La entidad aseguradora no debe exceder 8 caracteres")
    @Schema(
            description = "Entidad aseguradora del paciente",
            example = "ESSALUD"
    )
    private String entidadAseguradora;

    @NotBlank(message = "El código aseguradora es obligatorio")
    @Size(max = 20, message = "El código aseguradora no debe exceder 20 caracteres")
    @Schema(
            description = "Código de aseguradora del paciente",
            example = "ASEG-2026-001"
    )
    private String codigoAseguradora;

    @Schema(
            description = "Estado del paciente",
            example = "1"
    )
    private Integer estado;

    @Valid
    @NotNull(message = "La persona es obligatoria")
    @Schema(description = "Información personal del paciente")
    private PersonaCrearDTO persona;

}