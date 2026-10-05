package com.salud.consultorio.dto.empleado;

import com.salud.consultorio.dto.persona.PersonaActualizarDTO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record EmpleadoActualizarDTO(

        @NotNull(message = "Los datos de la persona son obligatorios")
        @Valid
        PersonaActualizarDTO persona,

        @NotNull(message = "El cargo es obligatorio")
        @Positive(message = "El cargo debe ser válido")
        Integer idCargo

) {
}