package com.salud.consultorio.dto.rol;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
@NoArgsConstructor
@Schema(description = "DTO de respuesta de información del rol")
public class RolRespuestaDTO {

    @Schema(
            description = "Identificador único del rol",
            example = "1"
    )
    private Integer id;

    @Schema(
            description = "Nombre del rol",
            example = "ADMINISTRADOR"
    )
    private String nombre;

    @Schema(
            description = "Descripción del rol",
            example = "Rol con acceso completo al sistema"
    )
    private String descripcion;

    @Schema(
            description = "Estado actual del rol",
            example = "1"
    )
    private Integer estado;

}