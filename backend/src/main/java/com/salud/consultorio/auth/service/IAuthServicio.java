package com.salud.consultorio.auth.service;

import com.salud.consultorio.auth.dto.CambiarClaveRequest;
import com.salud.consultorio.auth.dto.EstadoCuentaResponse;
import com.salud.consultorio.auth.dto.InicioSolicitud;
import com.salud.consultorio.auth.dto.LoginResponse;
import com.salud.consultorio.auth.dto.PerfilDTO;
import com.salud.consultorio.auth.dto.SeleccionarRolRequest;
import com.salud.consultorio.auth.dto.TokenResponse;
import com.salud.consultorio.dto.usuario.UsuarioAltaDTO;
import com.salud.consultorio.dto.usuario.UsuarioCreadoDTO;

import java.util.List;

public interface IAuthServicio {

    UsuarioCreadoDTO crearUsuario(UsuarioAltaDTO dto);

    LoginResponse ingresar(InicioSolicitud request);

    TokenResponse seleccionarRol(SeleccionarRolRequest request);

    TokenResponse cambiarPerfil(String nombreUsuario, Integer idRol);

    List<PerfilDTO> misPerfiles(String nombreUsuario);

    TokenResponse refrescarToken(String authHeader);

    void cambiarClave(String nombreUsuario, CambiarClaveRequest dto);

    EstadoCuentaResponse estadoCuenta(String nombreUsuario);

    void validarNoEsCuentaPropia(Integer idUsuario, String usuarioActual, String mensaje);

    void revocarSesionesUsuario(Integer idUsuario);

}