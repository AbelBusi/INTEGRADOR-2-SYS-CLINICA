package com.salud.consultorio.dto.recepcionista;

import com.salud.consultorio.dto.persona.PersonaLeerDTO;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
@Schema(description = "DTO de lectura detallada de recepcionistas")
public class RecepcionistaDetalleLeerDTO {

    @Schema(
            description = "Identificador único del recepcionista",
            example = "1"
    )
    private Integer id;

    @Schema(description = "Información personal del recepcionista")
    private PersonaLeerDTO persona;

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

    public RecepcionistaDetalleLeerDTO(Integer id, PersonaLeerDTO persona, String codigoEmpleado, Integer estado) {
        this.id = id;
        this.persona = persona;
        this.codigoEmpleado = codigoEmpleado;
        this.estado = estado;
    }
}
