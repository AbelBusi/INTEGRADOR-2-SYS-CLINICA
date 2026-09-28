package com.salud.consultorio.dto.doctor;

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
@Schema(description = "DTO de nombres de doctores")
public class NombreDoctoresDTO {

    @NotNull(message = "El id del doctor es obligatorio")
    @Schema(
            description = "Identificador único del doctor",
            example = "3"
    )
    private Integer idDoctor;

    @NotBlank(message = "El nombre del doctor es obligatorio")
    @Schema(
            description = "Nombre completo del doctor",
            example = "María Fernández"
    )
    private String nombreDoctor;

    public NombreDoctoresDTO(Integer idDoctor, String nombreDoctor) {
        this.idDoctor = idDoctor;
        this.nombreDoctor = nombreDoctor;
    }
}