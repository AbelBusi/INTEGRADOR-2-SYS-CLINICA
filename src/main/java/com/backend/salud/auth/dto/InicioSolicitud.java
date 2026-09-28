package com.backend.salud.auth.dto;

public record InicioSolicitud(
        String usuario,
        String claveAcceso
) {
}