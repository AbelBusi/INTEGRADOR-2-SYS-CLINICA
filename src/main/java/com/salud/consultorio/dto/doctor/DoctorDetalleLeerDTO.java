package com.salud.consultorio.dto.doctor;

import com.salud.consultorio.dto.especialidad.EspecialidadDoctorLeerDTO;
import com.salud.consultorio.dto.persona.PersonaLeerDTO;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
@Schema(description = "DTO de lectura detallada de los doctores")
public class DoctorDetalleLeerDTO {

    @Schema(
            description = "Identificador único del doctor",
            example = "1"
    )
    private Integer id;

    @Schema(description = "Información personal del doctor")
    private PersonaLeerDTO persona;

    private String cpm;

    private String rne;

    private String consejoRegional;

    private EspecialidadDoctorLeerDTO especialidad;

    @Schema(
            description = "Estado actual del doctor",
            example = "1"
    )
    private Integer estado;

    public DoctorDetalleLeerDTO(Integer id, PersonaLeerDTO persona, String cpm, String rne, String consejoRegional, EspecialidadDoctorLeerDTO especialidad, Integer estado) {
        this.id = id;
        this.persona = persona;
        this.cpm = cpm;
        this.rne = rne;
        this.consejoRegional = consejoRegional;
        this.especialidad = especialidad;
        this.estado = estado;
    }
}