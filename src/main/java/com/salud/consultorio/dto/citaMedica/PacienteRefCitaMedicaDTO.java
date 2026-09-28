package com.salud.consultorio.dto.citaMedica;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Schema(description = "DTO de referencia del paciente para la cita médica")
public class PacienteRefCitaMedicaDTO {

    @NotNull(message = "El id del paciente es obligatorio")
    @Schema(
            description = "Identificador único del paciente",
            example = "5"
    )
    private Integer id;

}