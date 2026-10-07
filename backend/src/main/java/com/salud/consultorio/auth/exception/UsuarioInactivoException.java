package com.salud.consultorio.auth.exception;

public class UsuarioInactivoException extends RuntimeException{

    public UsuarioInactivoException(String mensaje){
        super(mensaje);
    }

}