package com.salud.consultorio.util;

import java.text.Normalizer;
import java.util.Locale;

/**
 * Normaliza texto para comparar sin que importen mayúsculas, tildes, signos ni espacios repetidos.
 * "Paracetamol", "PARACETAMOL " y "paracetámol" producen la misma clave.
 */
public final class NormalizadorTexto {

    private NormalizadorTexto() {
    }

    /** Minúsculas, sin tildes, solo letras y números separados por un espacio. */
    public static String normalizar(String texto) {
        if (texto == null) {
            return "";
        }

        String sinTildes = Normalizer.normalize(texto, Normalizer.Form.NFD).replaceAll("\\p{M}+", "");

        return sinTildes.toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9]+", " ").trim();
    }

    /** Igual que {@link #normalizar} pero sin espacios: "500 mg" y "500mg" son la misma clave. */
    public static String compactar(String texto) {
        return normalizar(texto).replace(" ", "");
    }

    /** Distancia de Levenshtein entre dos textos (número de ediciones para convertir uno en otro). */
    public static int distancia(String a, String b) {
        int[] anterior = new int[b.length() + 1];
        int[] actual = new int[b.length() + 1];

        for (int j = 0; j <= b.length(); j++) {
            anterior[j] = j;
        }

        for (int i = 1; i <= a.length(); i++) {
            actual[0] = i;

            for (int j = 1; j <= b.length(); j++) {
                int costo = a.charAt(i - 1) == b.charAt(j - 1) ? 0 : 1;
                actual[j] = Math.min(
                        Math.min(actual[j - 1] + 1, anterior[j] + 1),
                        anterior[j - 1] + costo);
            }

            int[] temporal = anterior;
            anterior = actual;
            actual = temporal;
        }

        return anterior[b.length()];
    }

    /** Parecido entre 0 y 1 (1 = idénticos). */
    public static double similitud(String a, String b) {
        int mayor = Math.max(a.length(), b.length());

        if (mayor == 0) {
            return 1;
        }

        return 1.0 - (double) distancia(a, b) / mayor;
    }
}
