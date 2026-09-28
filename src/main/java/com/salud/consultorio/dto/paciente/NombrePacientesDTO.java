package com.salud.consultorio.dto.paciente;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Schema(description = "DTO de nombres de pacientes")
public class NombrePacientesDTO {

    @NotNull(message = "El id del paciente es obligatorio")
    @Schema(
            description = "Identificador único del paciente",
            example = "1"
    )
    private Integer idPaciente;

    @NotBlank(message = "El nombre del paciente es obligatorio")
    @Schema(
            description = "Nombre completo del paciente",
            example = "José Ramírez"
    )
    private String nombrePaciente;

    public NombrePacientesDTO(Integer idPaciente, String nombrePaciente) {
        this.idPaciente = idPaciente;
        this.nombrePaciente = nombrePaciente;
    }
}