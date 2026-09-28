package com.salud.consultorio.dto.paciente;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
@Schema(description = "DTO de lectura de pacientes")
public class PacienteLeerDTO {

    @Schema(
            description = "Identificador único del paciente",
            example = "1"
    )
    private Integer id;

    @Schema(
            description = "DNI del paciente",
            example = "87654321"
    )
    private String dni;

    @Schema(
            description = "Nombre completo del paciente",
            example = "Lucía Torres"
    )
    private String paciente;

    @Schema(
            description = "Género del paciente",
            example = "Femenino"
    )
    private String genero;

    @Schema(
            description = "Número telefónico del paciente",
            example = "987654321"
    )
    private String telefono;

    @Schema(
            description = "Entidad aseguradora del paciente",
            example = "ESSALUD"
    )
    private String entidadAseguradora;

    @Schema(
            description = "Estado actual del paciente",
            example = "1"
    )
    private Integer estado;

    public PacienteLeerDTO(
            Integer id,
            String dni,
            String paciente,
            String genero,
            String telefono,
            String entidadAseguradora,
            Integer estado
    ) {
        this.id = id;
        this.dni = dni;
        this.paciente = paciente;
        this.genero = genero;
        this.telefono = telefono;
        this.entidadAseguradora = entidadAseguradora;
        this.estado = estado;
    }
}