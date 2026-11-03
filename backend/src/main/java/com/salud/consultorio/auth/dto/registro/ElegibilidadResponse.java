package com.salud.consultorio.auth.dto.registro;

public record ElegibilidadResponse(
        EstadoRegistro estado,
        String mensaje,
        boolean tieneCorreo,
        String correoEnmascarado
) {}