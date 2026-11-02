package com.salud.consultorio.dto.empleado;

import java.time.LocalDate;

public record EmpleadoRespuestaDTO(
        Integer id,
        Integer idPersona,
        Integer idCargo,
        String cargo,
        LocalDate fechaIngreso,
        LocalDate fechaRetiro,
        String foto,
        Integer estado
) {
}