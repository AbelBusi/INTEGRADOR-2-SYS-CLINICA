package com.salud.consultorio.dto.paciente;

public record PacienteIDPorBuscarNroDocDTO(
        Integer idPaciente,
        Integer idPersona,
        Integer idEmpleado,
        String nombres,
        String accion

) {
}