package com.salud.consultorio.dto.especialidad;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Data
@NoArgsConstructor
@Getter
@Setter
@Schema(description = "DTO de lectura de especialidades médicas")
public class EspecialidadLeerDTO {

    @Schema(
            description = "Identificador único de la especialidad médica",
            example = "1"
    )
    private Integer id;

    @Schema(
            description = "Nombre de la especialidad médica",
            example = "Dermatología"
    )
    private String nombre;

    @Schema(
            description = "Descripción de la especialidad médica",
            example = "Especialidad enfocada en enfermedades de la piel"
    )
    private String descripcion;

    @Schema(
            description = "Estado actual de la especialidad médica",
            example = "1"
    )
    private Integer estado;

    public EspecialidadLeerDTO(Integer id, String nombre, String descripcion, Integer estado) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.estado = estado;
    }
}