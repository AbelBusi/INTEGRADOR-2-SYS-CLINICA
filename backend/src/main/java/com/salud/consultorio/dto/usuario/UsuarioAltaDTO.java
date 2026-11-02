package com.salud.consultorio.dto.usuario;

import com.salud.consultorio.model.enums.TipoUsuario;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.util.List;

public record UsuarioAltaDTO(

        @NotNull(message = "La persona es obligatoria")
        @Positive(message = "La persona debe ser válida")
        Integer idPersona,

        @NotNull(message = "El tipo de usuario es obligatorio")
        TipoUsuario tipo,

        List<@NotNull(message = "El rol no puede ser nulo")
        @Positive(message = "El rol debe ser válido") Integer> idRoles

) {}