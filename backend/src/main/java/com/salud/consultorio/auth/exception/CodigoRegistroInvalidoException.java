package com.salud.consultorio.auth.exception;

public class CodigoRegistroInvalidoException extends IllegalArgumentException {
  public CodigoRegistroInvalidoException(String mensaje) {
    super(mensaje);
  }
}
