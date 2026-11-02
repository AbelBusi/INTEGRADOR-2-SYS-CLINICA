package com.salud.consultorio.dto.usuario;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record UsuarioCambiarRolDTO(

        @NotNull(message = "El rol es obligatorio")
        @Positive(message = "El rol debe ser válido")
        Integer idRol

) {}