package com.salud.consultorio.util;

import java.util.List;

public final class EstadoDerivacion {

    public static final int ELIMINADA = 0;
    public static final int PENDIENTE = 1;
    public static final int PROGRAMADA = 2;
    public static final int CANCELADA = 3;

    private EstadoDerivacion() {
    }

    public static final List<Integer> VIGENTES = List.of(PENDIENTE, PROGRAMADA);

}