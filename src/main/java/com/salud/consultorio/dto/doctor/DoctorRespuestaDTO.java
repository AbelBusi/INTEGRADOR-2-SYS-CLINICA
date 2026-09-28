package com.salud.consultorio.dto.doctor;

import com.salud.consultorio.dto.persona.PersonaRespuestaDTO;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "DTO de respuesta de información del doctor")
public class DoctorRespuestaDTO {

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
            description = "Registro Nacional de Especialista del doctor",
            example = "RNE78910"
    )
    private String rne;

    @Schema(
            description = "Consejo regional médico al que pertenece el doctor",
            example = "Consejo Regional III Lima"
    )
    private String consejoRegional;

    @Schema(
            description = "Foto o imagen del doctor",
            example = "doctor1.jpg"
    )
    private String foto;

    @Schema(description = "Información personal del doctor")
    private PersonaRespuestaDTO persona;

    @Schema(description = "Especialidad médica del doctor")
    private EspecialidadRefDoctorDTO especialidad;

    @Schema(
            description = "Estado actual del doctor",
            example = "1"
    )
    private Integer estado;

}