package com.salud.consultorio.auth.service;

public interface IRecuperacionClaveServicio {
    void solicitarCodigo(String usuario);
    void verificarCodigo(String usuario, String codigo);
    void restablecerClave(String usuario, String codigo, String nuevaClave);
}