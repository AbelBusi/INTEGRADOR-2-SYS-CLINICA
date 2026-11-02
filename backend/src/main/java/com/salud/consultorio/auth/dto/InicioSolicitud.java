package com.salud.consultorio.auth.dto;

public record InicioSolicitud(
        String usuario,
        String claveAcceso
) {
}