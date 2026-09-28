package com.salud.consultorio.auth.dto;
import com.salud.consultorio.dto.persona.PersonaRefDTO;
import com.salud.consultorio.dto.rol.RolRefDTO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder(toBuilder = true)
public class UsuarioCrearDTO {

    @NotNull(message = "La persona es obligatoria")
    @Valid
    private PersonaRefDTO persona;

    @NotNull(message = "El rol es obligatorio")
    @Valid
    private RolRefDTO rol;

    @NotBlank(message = "El usuario no puede estar vacío")
    @Size(min = 3, max = 50, message = "El usuario debe tener entre 3 y 50 caracteres")
    private String usuario;

    @NotBlank(message = "La clave de acceso es obligatoria")
    @Size(min = 6, max = 100, message = "La clave debe tener mínimo 6 caracteres")
    private String claveAcceso;

    @NotNull(message = "El estado es obligatorio")
    @Min(value = 0, message = "Estado inválido")
    @Max(value = 1, message = "Estado inválido")
    private Integer estado;

}