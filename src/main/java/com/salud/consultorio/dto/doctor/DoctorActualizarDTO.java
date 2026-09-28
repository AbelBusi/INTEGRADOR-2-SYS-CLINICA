package com.salud.consultorio.dto.doctor;

import com.salud.consultorio.dto.persona.PersonaActualizarDTO;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "DTO para actualizar información de un doctor")
public class DoctorActualizarDTO {

    @NotBlank(message = "El CPM es obligatorio")
    @Size(max = 20, message = "El CPM no debe exceder 20 caracteres")
    @Schema(
            description = "Código CMP del doctor",
            example = "CMP123456"
    )
    private String cpm;

    @Size(max = 20, message = "El RNE no debe exceder 20 caracteres")
    @Schema(
            description = "Registro Nacional de Especialista del doctor",
            example = "RNE78910"
    )
    private String rne;

    @NotBlank(message = "El consejo regional es obligatorio")
    @Size(max = 50, message = "El consejo regional no debe exceder 50 caracteres")
    @Schema(
            description = "Consejo regional médico al que pertenece el doctor",
            example = "Consejo Regional III Lima"
    )
    private String consejoRegional;

    @NotBlank(message = "La foto es obligatoria")
    @Size(max = 100, message = "La foto no debe exceder 100 caracteres")
    @Schema(
            description = "URL o nombre de la foto del doctor",
            example = "doctor_actualizado.jpg"
    )
    private String foto;

    @Valid
    @NotNull(message = "La persona es obligatoria")
    @Schema(description = "Información actualizada de la persona asociada al doctor")
    private PersonaActualizarDTO persona;

    @Valid
    @NotNull(message = "La especialidad del doctor es obligatoria")
    @Schema(description = "Especialidad médica asignada al doctor")
    private EspecialidadRefDoctorDTO especialidad;

    @Schema(
            description = "Estado actual del doctor",
            example = "1"
    )
    private Integer estado;

}