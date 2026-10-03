package com.salud.consultorio.auth.service;

import com.salud.consultorio.model.entity.Usuario;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;

public interface IJwtServicio {

    String extraerUsuario(String token);

    String generarToken(Usuario usuario);

    String generarTokenRefrescado(Usuario usuario);

    String construirToken(Usuario usuario, Integer expiration);

    boolean tokenValido(final String token, UserDetails usuario);

    boolean tokenExpirado(String token);

    List<String> extraerPermisos(final String token);
}