package com.salud.consultorio.auth.exception;

public class CorreoEnvioException extends RuntimeException {

    public CorreoEnvioException(String mensaje, Throwable causa) {
        super(mensaje, causa);
    }

}