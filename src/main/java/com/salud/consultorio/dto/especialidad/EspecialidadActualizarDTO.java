package com.salud.consultorio.dto.especialidad;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "DTO para actualizar una especialidad médica")
public class EspecialidadActualizarDTO {

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 40, message = "El nombre no puede superar los 40 caracteres")
    @Schema(
            description = "Nombre de la especialidad médica",
            example = "Neurología"
    )
    private String nombre;

    @NotBlank(message = "La descripción es obligatoria")
    @Size(max = 100, message = "La descripción no puede superar los 100 caracteres")
    @Schema(
            description = "Descripción actualizada de la especialidad médica",
            example = "Especialidad enfocada en el sistema nervioso"
    )
    private String descripcion;

    @Schema(
            description = "Estado actual de la especialidad médica",
            example = "1"
    )
    private Integer estado;

}