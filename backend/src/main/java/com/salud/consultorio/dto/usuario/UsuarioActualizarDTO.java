package com.salud.consultorio.dto.usuario;

import com.salud.consultorio.dto.persona.PersonaRefDTO;
import com.salud.consultorio.dto.rol.RolRefDTO;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder(toBuilder = true)
@Schema(description = "DTO para actualizar información de un usuario")
public class UsuarioActualizarDTO {

    @Schema(
            description = "Identificador único del usuario",
            example = "1"
    )
    private Integer id;

    @NotNull(message = "La persona es obligatoria")
    @Valid
    @Schema(description = "Persona asociada al usuario")
    private PersonaRefDTO persona;

    @NotNull(message = "El rol es obligatorio")
    @Valid
    @Schema(description = "Rol asignado al usuario")
    private RolRefDTO rol;

    @NotBlank(message = "El usuario no puede estar vacío")
    @Size(min = 3, max = 50, message = "El usuario debe tener entre 3 y 50 caracteres")
    @Schema(
            description = "Nombre de usuario para iniciar sesión",
            example = "admin01"
    )
    private String usuario;

    @NotBlank(message = "La clave de acceso es obligatoria")
    @Size(min = 6, max = 100, message = "La clave debe tener mínimo 6 caracteres")
    @Schema(
            description = "Clave de acceso del usuario",
            example = "Admin123"
    )
    private String claveAcceso;

    @NotNull(message = "El estado es obligatorio")
    @Min(value = 0, message = "Estado inválido")
    @Max(value = 1, message = "Estado inválido")
    @Schema(
            description = "Estado actual del usuario",
            example = "1"
    )
    private Integer estado;

}