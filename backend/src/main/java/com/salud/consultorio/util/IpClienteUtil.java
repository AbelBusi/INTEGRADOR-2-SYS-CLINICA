package com.salud.consultorio.util;

import jakarta.servlet.http.HttpServletRequest;

public final class IpClienteUtil {

    private IpClienteUtil() {
    }

    public static String obtener(HttpServletRequest request) {
        String reenviada = request.getHeader("X-Forwarded-For");
        if (reenviada != null && !reenviada.isBlank()) {
            return reenviada.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}