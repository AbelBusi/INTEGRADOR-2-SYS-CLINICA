package com.salud.consultorio.auth.exception;

public class SmsEnvioException extends RuntimeException {

    public SmsEnvioException(String mensaje, Throwable causa) {
        super(mensaje, causa);
    }
}