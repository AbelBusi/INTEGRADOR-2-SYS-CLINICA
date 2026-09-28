package com.salud.consultorio.dto.especialidad;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "DTO de respuesta de especialidad médica")
public class EspecialidadRespuestaDTO {

    @Schema(
            description = "Identificador único de la especialidad médica",
            example = "1"
    )
    private Integer id;

    @Schema(
            description = "Nombre de la especialidad médica",
            example = "Pediatría"
    )
    private String nombre;

    @Schema(
            description = "Descripción de la especialidad médica",
            example = "Especialidad médica enfocada en la atención infantil"
    )
    private String descripcion;

    @Schema(
            description = "Estado actual de la especialidad médica",
            example = "1"
    )
    private Integer estado;

}