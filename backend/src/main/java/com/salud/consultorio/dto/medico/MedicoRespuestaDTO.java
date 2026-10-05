package com.salud.consultorio.dto.medico;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Respuesta al crear o actualizar un doctor")
public record MedicoRespuestaDTO(

        @Schema(description = "ID del doctor", example = "1")
        Integer id,

        @Schema(description = "ID del empleado asociado", example = "1")
        Integer idEmpleado,

        @Schema(description = "ID de la especialidad", example = "2")
        Integer idEspecialidad,

        @Schema(description = "Nombre de la especialidad", example = "Cardiología")
        String especialidad,

        @Schema(description = "Número de colegiatura", example = "045678")
        String numeroColegiatura,

        @Schema(description = "Número de especialidad", example = "RNE-12345")
        String numeroEspecialidad,

        @Schema(description = "Consejo regional", example = "CR Lima")
        String consejoRegional,

        @Schema(description = "Estado: 0 eliminado, 1 activo, 2 inactivo", example = "1")
        Integer estado

) {
}