package com.salud.consultorio.dto.paciente;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "DTO de lectura de pacientes")
public record PacienteLeerDTO (

    @Schema(
            description = "Identificador único del paciente",
            example = "1"
    )
    Integer id,

    @Schema(
            description = "Nombre y apellidos completo del paciente",
            example = "Lucía Torres"
    )
    String paciente,

    @Schema(
            description = "Género del paciente",
            example = "Femenino"
    )
    String genero,

    @Schema(
            description = "Número telefónico del paciente",
            example = "987654321"
    )
    String telefono,

    @Schema(
            description = "Codigo de la entidad aseguradora del paciente",
            example = "ES-234-3443"
    )
    String codigoAsegurado,

    @Schema(
            description = "Entidad aseguradora del paciente",
            example = "ESSALUD"
    )
    String entidadAsegurado,

    @Schema(
            description = "Estado actual del paciente",
            example = "1"
    )
    Integer estado

){}