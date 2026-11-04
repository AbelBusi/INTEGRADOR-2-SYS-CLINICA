package com.salud.consultorio.dto.usuario;

import java.util.List;

public record RolesAsignablesDTO(
        Integer idPersona,
        String nombreCompleto,
        String numeroDocumento,
        boolean esPaciente,
        boolean esEmpleado,
        boolean esMedico,
        String cargo,
        List<RolOpcionDTO> roles,
        List<String> avisos
) {}