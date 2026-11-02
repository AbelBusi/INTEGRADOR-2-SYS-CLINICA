package com.salud.consultorio.dto.empleado;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record EmpleadoDetalleDTO(
        Integer id,
        Integer idTipoDocumento,
        String codigoTipoDocumento,
        String descripcionTipoDocumento,
        String numeroDocumento,
        String nombre,
        String apellidos,
        LocalDate fechaNacimiento,
        String genero,
        String telefono,
        String direccion,
        String correo,
        String nacionalidad,
        LocalDateTime fechaCreacion,
        LocalDateTime fechaActualizacion,
        Integer idCargo,
        String cargo,
        LocalDate fechaIngreso,
        LocalDate fechaRetiro,
        String foto,
        Integer estado
) {
}