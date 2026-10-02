package com.salud.consultorio.dto.empleado;

import java.time.LocalDate;

public record EmpleadoLeerDTO(
        Integer id,
        String nombreCompleto,
        String numeroDocumento,
        String telefono,
        String cargo,
        LocalDate fechaIngreso,
        String foto,
        Integer estado
) {
}