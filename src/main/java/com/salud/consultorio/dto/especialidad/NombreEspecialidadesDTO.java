package com.salud.consultorio.dto.especialidad;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "DTO de nombres de especialidades médicas")
public class NombreEspecialidadesDTO {

    @NotNull(message = "El id de la especialidad es obligatorio")
    @Schema(
            description = "Identificador único de la especialidad médica",
            example = "2"
    )
    private Integer idEspecialidad;

    @NotBlank(message = "El nombre de la especialidad es obligatorio")
    @Schema(
            description = "Nombre de la especialidad médica",
            example = "Traumatología"
    )
    private String nombreEspecialidad;

}