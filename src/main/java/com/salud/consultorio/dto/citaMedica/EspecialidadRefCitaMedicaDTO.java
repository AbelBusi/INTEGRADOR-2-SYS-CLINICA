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
@Schema(description = "DTO de referencia de especialidad para la cita médica")
public class EspecialidadRefCitaMedicaDTO {

    @NotNull(message = "El id de la especialidad es obligatorio")
    @Schema(
            description = "Identificador único de la especialidad médica",
            example = "2"
    )
    private Integer id;

}