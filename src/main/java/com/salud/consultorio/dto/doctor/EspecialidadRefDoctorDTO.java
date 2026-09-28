package com.salud.consultorio.dto.doctor;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Schema(description = "DTO de referencia de especialidad para el doctor")
public class EspecialidadRefDoctorDTO {

    @NotNull(message = "El id de la especialidad es obligatorio")
    @Schema(
            description = "Identificador único de la especialidad médica",
            example = "4"
    )
    private Integer id;

}