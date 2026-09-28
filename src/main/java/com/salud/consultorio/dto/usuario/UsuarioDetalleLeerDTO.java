package com.salud.consultorio.dto.usuario;

import com.salud.consultorio.dto.persona.PersonaLeerDTO;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
@Schema(description = "DTO de lectura detallada del usuario")
public class UsuarioDetalleLeerDTO {

    @Schema(
            description = "Identificador único del usuario",
            example = "1"
    )
    private Integer id;

    @Schema(description = "Información personal asociada al usuario")
    private PersonaLeerDTO persona;

    @Schema(
            description = "Nombre de usuario",
            example = "admin01"
    )
    private String usuario;

    @Schema(
            description = "Rol asignado al usuario",
            example = "ADMINISTRADOR"
    )
    private String nombreRol;

    @Schema(
            description = "Estado actual del usuario",
            example = "1"
    )
    private Integer estado;

    @Schema(
            description = "Tipo de persona asociada al usuario",
            example = "DOCTOR"
    )
    private String tipo;

    public UsuarioDetalleLeerDTO(Integer id, PersonaLeerDTO persona, String usuario, String nombreRol, Integer estado, String tipo) {
        this.id = id;
        this.persona = persona;
        this.usuario = usuario;
        this.nombreRol = nombreRol;
        this.estado = estado;
        this.tipo = tipo;
    }
}
