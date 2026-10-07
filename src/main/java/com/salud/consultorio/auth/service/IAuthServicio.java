package com.salud.consultorio.auth.service;

import com.salud.consultorio.auth.dto.InicioSolicitud;
import com.salud.consultorio.auth.dto.TokenResponse;
import com.salud.consultorio.auth.dto.UsuarioCrearDTO;
import com.salud.consultorio.dto.usuario.UsuarioAltaDTO;
import com.salud.consultorio.dto.usuario.UsuarioCreadoDTO;

public interface IAuthServicio {

    UsuarioCreadoDTO crearUsuario(UsuarioAltaDTO dto);

    TokenResponse ingresar(InicioSolicitud request);

    TokenResponse refrescarToken(String authHeder);

}