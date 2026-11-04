package com.salud.consultorio.auth.exception;

public class OperacionBloqueadaException extends RuntimeException {
    public OperacionBloqueadaException(String mensaje) { super(mensaje); }
}