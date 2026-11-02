package com.salud.consultorio.auth.service;

import com.salud.consultorio.model.entity.Rol;
import com.salud.consultorio.model.entity.Usuario;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;

public interface IJwtServicio {

    String TIPO_ACCESO = "acceso";
    String TIPO_REFRESH = "refresh";
    String TIPO_SELECCION = "seleccion";

    String extraerUsuario(String token);

    String generarToken(Usuario usuario, Rol rol);

    String generarTokenRefrescado(Usuario usuario, Rol rol);

    String generarTokenSeleccion(Usuario usuario);

    String extraerTipo(String token);

    Integer extraerIdRol(String token);

    boolean tokenValido(String token, UserDetails userDetails);

    boolean tokenExpirado(String token);

    List<String> extraerPermisos(String token);

}