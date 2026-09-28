package com.salud.consultorio.dto.usuario;

import com.salud.consultorio.dto.persona.PersonaRefDTO;
import com.salud.consultorio.dto.rol.RolRefDTO;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder(toBuilder = true)
@Schema(description = "DTO de respuesta de información del usuario")
public class UsuarioRespuestaDTO {

    @Schema(
            description = "Identificador único del usuario",
            example = "1"
    )
    private Integer id;

    @Schema(description = "Persona asociada al usuario")
    private PersonaRefDTO persona;

    @Schema(description = "Rol asignado al usuario")
    private RolRefDTO rol;

    @Schema(
            description = "Nombre de usuario",
            example = "admin01"
    )
    private String usuario;

    @Schema(
            description = "Clave de acceso del usuario",
            example = "Admin123"
    )
    private String claveAcceso;

    @Schema(
            description = "Estado actual del usuario",
            example = "1"
    )
    private Integer estado;

}