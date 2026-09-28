package com.salud.consultorio.dto.recepcionista;

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
@Schema(description = "DTO de referencia de recepcionista para cita médica")
public class RecepcionistaRefCitaMedicaDTO {

    @NotNull(message = "El id de la recepcionista es obligatorio")
    @Schema(
            description = "Identificador único del recepcionista",
            example = "1"
    )
    private Integer id;

}