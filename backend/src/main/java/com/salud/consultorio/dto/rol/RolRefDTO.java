package com.salud.consultorio.dto.rol;

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
@Schema(description = "DTO de referencia de rol")
public class RolRefDTO {

    @NotNull(message = "El id del rol es obligatorio")
    @Schema(
            description = "Identificador único del rol",
            example = "1"
    )
    private Integer id;

}