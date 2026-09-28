package com.salud.consultorio.dto.doctor;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
@Schema(description = "DTO de lectura de doctores con especialidad")
public class DoctorEspecialidadLeerDTO {

    @Schema(
            description = "Identificador único del doctor",
            example = "1"
    )
    private Integer id;

    @Schema(
            description = "Código CMP del doctor",
            example = "CMP123456"
    )
    private String cpm;

    @Schema(
            description = "Nombre del doctor",
            example = "Carlos"
    )
    private String nombre;

    @Schema(
            description = "Apellidos del doctor",
            example = "Ramírez Soto"
    )
    private String apellidos;

    @Schema(
            description = "Especialidad médica del doctor",
            example = "Cardiología"
    )
    private String especialidad;

    @Schema(
            description = "Género del doctor",
            example = "Masculino"
    )
    private String genero;

    @Schema(
            description = "Estado actual del doctor",
            example = "1"
    )
    private Integer estado;

    public DoctorEspecialidadLeerDTO(
            Integer id,
            String cpm,
            String nombre,
            String apellidos,
            String especialidad,
            String genero,
            Integer estado
    ) {
        this.id = id;
        this.cpm = cpm;
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.especialidad = especialidad;
        this.genero = genero;
        this.estado = estado;
    }
}
