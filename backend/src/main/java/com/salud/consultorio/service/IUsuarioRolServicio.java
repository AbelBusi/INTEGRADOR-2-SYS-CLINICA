package com.salud.consultorio.service;

public interface IUsuarioRolServicio {

    boolean existeUsuarioPorRol(Integer idRol);

    void revocarSesionesPorRol(Integer idRol);

    void asignarRol(Integer idUsuario, Integer idRol);

    void revocarRol(Integer idUsuario, Integer idRol);

}