package com.salud.consultorio.dto.especialidad;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@NoArgsConstructor
@Getter
@Setter
@Schema(description = "DTO de lectura de especialidades médicas")
public class EspecialidadDoctorLeerDTO {

    @Schema(
            description = "Nombre de la especialidad médica",
            example = "Dermatología"
    )
    private String nombre;

    public EspecialidadDoctorLeerDTO(String nombre) {
        this.nombre = nombre;
    }
}