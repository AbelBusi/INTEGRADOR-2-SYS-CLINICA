package com.salud.consultorio.service;

import com.salud.consultorio.dto.perfil.ActualizarContactoRequest;
import com.salud.consultorio.dto.perfil.CambiarClavePerfilRequest;
import com.salud.consultorio.dto.perfil.PerfilDTO;

public interface IPerfilServicio {

    PerfilDTO obtener(String nombreUsuario);

    PerfilDTO actualizarContacto(String nombreUsuario, ActualizarContactoRequest dto);

    String solicitarCambioCorreo(String nombreUsuario, String nuevoCorreo);

    PerfilDTO confirmarCambioCorreo(String nombreUsuario, String codigo);

    void cambiarClave(String nombreUsuario, CambiarClavePerfilRequest dto);
}