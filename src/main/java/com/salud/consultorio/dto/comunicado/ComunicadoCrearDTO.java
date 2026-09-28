package com.salud.consultorio.dto.comunicado;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Schema(description = "DTO para registrar un comunicado de la clínica")
public class ComunicadoCrearDTO {

    @NotBlank(message = "El título es obligatorio")
    @Size(max = 150, message = "El título no debe exceder 150 caracteres")
    private String titulo;

    @NotBlank(message = "El mensaje es obligatorio")
    @Size(max = 1000, message = "El mensaje no debe exceder 1000 caracteres")
    private String mensaje;

}
