package com.salud.consultorio.dto.doctor;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
@Schema(description = "DTO de lectura de doctor por identificador")
public class DoctorEspecialidadPorIdDTO {

    @Schema(
            description = "Identificador único del doctor",
            example = "2"
    )
    private Integer id;

    @Schema(
            description = "Nombre completo del doctor",
            example = "Juan Pérez"
    )
    private String nombres;

    public DoctorEspecialidadPorIdDTO(Integer id, String nombres) {
        this.id = id;
        this.nombres = nombres;
    }


}