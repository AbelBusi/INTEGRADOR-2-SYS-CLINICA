package com.salud.consultorio.dto.paciente;

public record PacienteUsuarioEstadoDTO(
        Integer idPaciente,
        Integer idPersona,
        boolean tieneCorreo,
        boolean tieneUsuario
) {}