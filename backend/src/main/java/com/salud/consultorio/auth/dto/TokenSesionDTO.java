package com.salud.consultorio.auth.dto;

public record TokenSesionDTO(
        boolean expirado,
        boolean revocado,
        Integer estado,
        boolean requiereCambioClave
) { }