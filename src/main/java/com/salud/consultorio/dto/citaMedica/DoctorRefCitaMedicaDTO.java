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
@Schema(description = "DTO de referencia del doctor para la cita médica")
public class DoctorRefCitaMedicaDTO {

    @NotNull(message = "El id del doctor es obligatorio")
    @Schema(
            description = "Identificador único del doctor",
            example = "3"
    )
    private Integer id;

}