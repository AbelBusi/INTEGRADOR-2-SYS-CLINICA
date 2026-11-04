package com.salud.consultorio.dto.usuario;

public record PersonaBusquedaUsuarioDTO(
        Integer idPersona,
        String nombreCompleto,
        String tipoDocumento,
        String numeroDocumento,
        String genero,
        boolean esPaciente,
        boolean esEmpleado,
        boolean tieneCorreo
) {}