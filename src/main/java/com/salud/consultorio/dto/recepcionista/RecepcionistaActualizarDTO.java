package com.salud.consultorio.dto.recepcionista;

import com.salud.consultorio.dto.persona.PersonaActualizarDTO;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Schema(description = "DTO para actualizar información de un recepcionista")
public class RecepcionistaActualizarDTO {

    @Valid
    @NotNull(message = "La persona es obligatoria")
    @Schema(description = "Información personal actualizada del recepcionista")
    private PersonaActualizarDTO persona;

    @NotBlank(message = "El código de empleado es obligatorio")
    @Size(max = 25, message = "El código de empleado no debe exceder 25 caracteres")
    @Schema(
            description = "Código de empleado del recepcionista",
            example = "REC-2026-002"
    )
    private String codigoEmpleado;

    @Schema(
            description = "Estado actual del recepcionista",
            example = "1"
    )
    private Integer estado;

}