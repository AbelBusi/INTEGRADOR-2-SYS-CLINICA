package com.salud.consultorio.dto.empleado;

import lombok.Builder;

@Builder(toBuilder = true)
public record EmpleadoIDPorBuscarNroDocDTO(

        Integer idEmpleado,
        Integer idPersona,
        String nombres,
        String accion

) {
}