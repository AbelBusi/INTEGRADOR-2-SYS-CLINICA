package com.salud.consultorio.dto.recepcionista;

import com.salud.consultorio.dto.persona.PersonaRespuestaDTO;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Schema(description = "DTO de respuesta de información del recepcionista")
public class RecepcionistaRespuestaDTO {

    @Schema(description = "Información personal del recepcionista")
    private PersonaRespuestaDTO persona;

    @Schema(
            description = "Código de empleado del recepcionista",
            example = "REC-2026-001"
    )
    private String codigoEmpleado;

    @Schema(
            description = "Estado actual del recepcionista",
            example = "1"
    )
    private Integer estado;

}