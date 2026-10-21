package com.salud.consultorio.service;

import com.salud.consultorio.model.entity.Rol;

public interface IUsuarioRolReglasServicio {

    void validarAsignacion(Integer idUsuario, Integer idRol);

    void validarRevocacion(Integer idUsuario, Integer idRol);

    void validarRolAsignable(Integer idPersona, Rol rol);

}
