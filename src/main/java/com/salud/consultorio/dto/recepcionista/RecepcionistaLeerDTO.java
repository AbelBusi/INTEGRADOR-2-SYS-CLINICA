package com.salud.consultorio.dto.recepcionista;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@Schema(description = "DTO de lectura de recepcionistas")
public class RecepcionistaLeerDTO {

    @Schema(
            description = "Identificador único del recepcionista",
            example = "1"
    )
    private Integer id;

    @Schema(
            description = "Código de empleado del recepcionista",
            example = "REC-2026-001"
    )
    private String codigoEmpleado;

    @Schema(
            description = "Nombre del recepcionista",
            example = "Lucía"
    )
    private String nombre;

    @Schema(
            description = "Apellidos del recepcionista",
            example = "Fernández Torres"
    )
    private String apellidos;

    @Schema(
            description = "Género del recepcionista",
            example = "Femenino"
    )
    private String genero;

    @Schema(
            description = "Estado actual del recepcionista",
            example = "1"
    )
    private Integer estado;

    public RecepcionistaLeerDTO(
            Integer id,
            String codigoEmpleado,
            String nombre,
            String apellidos,
            String genero,
            Integer estado
    ) {
        this.id = id;
        this.codigoEmpleado = codigoEmpleado;
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.genero = genero;
        this.estado = estado;
    }
}