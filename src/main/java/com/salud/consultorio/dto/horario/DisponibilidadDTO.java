package com.salud.consultorio.dto.horario;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Schema(description = "DTO de disponibilidad de un trabajador")
public class DisponibilidadDTO {

    private Integer id;
    private String nombre;

    public DisponibilidadDTO(Integer id, String nombre) {
        this.id = id;
        this.nombre = nombre;
    }
}
