package com.salud.consultorio.dto.usuario;

public record RolOpcionDTO(
        Integer idRol,
        String nombre,
        boolean obligatorio,
        boolean recomendado
) {}