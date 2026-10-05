package com.salud.consultorio.dto.medico;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

@Schema(description = "Datos para registrar un medico a partir de un empleado existente")
public record MedicoCrearDTO(

        @Schema(description = "ID del empleado que será doctor (debe estar activo)", example = "1")
        @NotNull(message = "El empleado es obligatorio")
        @Positive(message = "El empleado debe ser válido")
        Integer idEmpleado,

        @Schema(description = "ID de la especialidad (debe estar activa)", example = "2")
        @NotNull(message = "La especialidad es obligatoria")
        @Positive(message = "La especialidad debe ser válida")
        Integer idEspecialidad,

        @Schema(description = "Número de colegiatura (CMP)", example = "045678")
        @NotBlank(message = "El número de colegiatura es obligatorio")
        @Size(max = 20, message = "El número de colegiatura no puede superar los 20 caracteres")
        String numeroColegiatura,

        @Schema(description = "Número de registro de especialidad (RNE)", example = "RNE-12345", nullable = true)
        @Size(max = 20, message = "El número de especialidad no puede superar los 20 caracteres")
        String numeroEspecialidad,

        @Schema(description = "Consejo regional al que pertenece", example = "CR Lima", nullable = true)
        @Size(max = 60, message = "El consejo regional no puede superar los 60 caracteres")
        String consejoRegional

) {
}