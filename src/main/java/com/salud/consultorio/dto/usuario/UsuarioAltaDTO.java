package com.salud.consultorio.dto.usuario;

import com.salud.consultorio.model.enums.TipoUsuario;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record UsuarioAltaDTO(

        @NotNull(message = "La persona es obligatoria")
        @Positive(message = "La persona debe ser válida")
        Integer idPersona,

        @NotNull(message = "El tipo de usuario es obligatorio")
        TipoUsuario tipo,

        @Positive(message = "El rol debe ser válido")
        Integer idRol

) {}