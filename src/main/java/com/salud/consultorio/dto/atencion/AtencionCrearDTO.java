package com.salud.consultorio.dto.atencion;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Schema(description = "DTO para registrar la atención médica al cerrar una cita")
public class AtencionCrearDTO {

    @NotBlank(message = "El diagnóstico es obligatorio")
    @Size(max = 500, message = "El diagnóstico no debe exceder 500 caracteres")
    @Schema(description = "Diagnóstico de la atención", example = "Faringitis aguda")
    private String diagnostico;

    @Size(max = 1000, message = "Las observaciones no deben exceder 1000 caracteres")
    @Schema(description = "Observaciones del doctor")
    private String observaciones;

    @Size(max = 1000, message = "El tratamiento no debe exceder 1000 caracteres")
    @Schema(description = "Tratamiento o indicaciones")
    private String tratamiento;

    @Size(max = 1000, message = "Las recomendaciones no deben exceder 1000 caracteres")
    @Schema(description = "Recomendaciones para el paciente")
    private String recomendaciones;

}
