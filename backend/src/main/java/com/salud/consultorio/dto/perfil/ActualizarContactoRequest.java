package com.salud.consultorio.dto.perfil;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ActualizarContactoRequest(

        @NotBlank(message = "El teléfono es obligatorio")
        @Size(max = 20, message = "El teléfono no puede superar los 20 caracteres")
        @Pattern(regexp = "^\\+?[0-9 ]{7,20}$", message = "El teléfono solo admite números, espacios y el prefijo +")
        String telefono,

        @NotBlank(message = "La dirección es obligatoria")
        @Size(max = 150, message = "La dirección no puede superar los 150 caracteres")
        String direccion

) {}