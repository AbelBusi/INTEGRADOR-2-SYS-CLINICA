package com.salud.consultorio.service;

public interface IVerificacionDobleFactorServicio {

    String metodo();

    boolean verificar(Integer idUsuario, String codigo);
}