package com.salud.consultorio.dto.medico;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Datos resumidos de un doctor para listados")
public record MedicoLeerDTO(

        @Schema(description = "ID del doctor", example = "1")
        Integer id,

        @Schema(description = "Nombre completo del doctor", example = "Carlos Ramírez Torres")
        String nombreCompleto,

        @Schema(description = "Cargo del empleado", example = "Médico")
        String cargo,

        @Schema(description = "Especialidad", example = "Cardiología")
        String especialidad,

        @Schema(description = "Número de colegiatura", example = "045678")
        String numeroColegiatura,

        @Schema(description = "Teléfono", example = "987654321")
        String telefono,

        @Schema(description = "Foto del empleado", example = "https://midominio.com/fotos/carlos.jpg")
        String foto,

        @Schema(description = "Estado: 1 activo, 2 inactivo", example = "1")
        Integer estado

) {
}