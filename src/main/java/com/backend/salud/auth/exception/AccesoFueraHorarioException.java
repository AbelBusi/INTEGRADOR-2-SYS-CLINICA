package com.backend.salud.auth.exception;

public class AccesoFueraHorarioException extends RuntimeException {

    public AccesoFueraHorarioException(String mensaje) {
        super(mensaje);
    }
}
