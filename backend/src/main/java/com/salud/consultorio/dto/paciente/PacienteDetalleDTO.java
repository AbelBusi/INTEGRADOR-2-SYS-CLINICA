package com.salud.consultorio.dto.paciente;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Schema(description = "Información detallada de un paciente")
public record PacienteDetalleDTO(

        @Schema(
                description = "Identificador único del paciente",
                example = "1"
        )
        Integer id,

        @Schema(
                description = "Identificador del tipo de documento",
                example = "1"
        )
        Integer idTipoDocumento,

        @Schema(
                description = "Código del tipo de documento",
                example = "DNI"
        )
        String codigoTipoDocumento,

        @Schema(
                description = "Descripción del tipo de documento",
                example = "Documento Nacional de Identidad"
        )
        String descripcionTipoDocumento,

        @Schema(
                description = "Número de documento de identidad",
                example = "72845631"
        )
        String numeroDocumento,

        @Schema(
                description = "Nombres del paciente",
                example = "Juan Carlos"
        )
        String nombre,

        @Schema(
                description = "Apellidos del paciente",
                example = "Pérez García"
        )
        String apellidos,

        @Schema(
                description = "Fecha de nacimiento del paciente",
                example = "2000-05-15"
        )
        LocalDate fechaNacimiento,

        @Schema(
                description = "Género del paciente",
                example = "MASCULINO"
        )
        String genero,

        @Schema(
                description = "Número telefónico del paciente",
                example = "987654321"
        )
        String telefono,

        @Schema(
                description = "Dirección de domicilio del paciente",
                example = "Av. Balta 123"
        )
        String direccion,

        @Schema(
                description = "Correo electrónico del paciente",
                example = "juan.perez@gmail.com"
        )
        String correo,

        @Schema(
                description = "Nacionalidad del paciente",
                example = "PERUANA"
        )
        String nacionalidad,

        @Schema(
                description = "Fecha y hora de creación del registro de persona",
                example = "2026-09-30T10:30:00"
        )
        LocalDateTime fechaCreacion,

        @Schema(
                description = "Fecha y hora de la última actualización del registro de persona",
                example = "2026-09-30T15:45:00"
        )
        LocalDateTime fechaActualizacion,

        @Schema(
                description = "Código del asegurado",
                example = "ASEG-000123"
        )
        String codigoAsegurado,

        @Schema(
                description = "Entidad responsable del aseguramiento",
                example = "SIS"
        )
        String entidadAsegurado,

        @Schema(
                description = "Estado del paciente: 1 activo, 2 inactivo",
                example = "1"
        )
        Integer estado
) {
}