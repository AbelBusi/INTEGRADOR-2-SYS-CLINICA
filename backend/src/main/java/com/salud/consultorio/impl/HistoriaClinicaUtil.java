package com.salud.consultorio.impl;

import java.util.Map;
import java.util.Objects;

final class HistoriaClinicaUtil {

    private HistoriaClinicaUtil() {}

    static String limpiar(String texto) {
        if (texto == null || texto.isBlank()) {
            return null;
        }
        return texto.trim();
    }

    // Registra el campo solo si realmente cambió; devuelve true si hubo cambio
    static boolean comparar(String campo, Object anterior, Object nuevo,
                            Map<String, Object> anteriores, Map<String, Object> nuevos) {
        if (Objects.equals(anterior, nuevo)) {
            return false;
        }
        anteriores.put(campo, anterior);
        nuevos.put(campo, nuevo);
        return true;
    }

}