package com.salud.consultorio.dto.persona;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Schema(description = "DTO de referencia de persona")
public class PersonaRefDTO {

    @NotNull(message = "El id de la persona es obligatorio")
    @Schema(
            description = "Identificador único de la persona",
            example = "1"
    )
    private Integer id;

}