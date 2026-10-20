package com.salud.consultorio.auth.service;

import com.salud.consultorio.auth.dto.CambiarClaveRequest;
import com.salud.consultorio.auth.dto.EstadoCuentaResponse;
import com.salud.consultorio.auth.dto.InicioSolicitud;
import com.salud.consultorio.auth.dto.TokenResponse;
import com.salud.consultorio.dto.usuario.UsuarioAltaDTO;
import com.salud.consultorio.dto.usuario.UsuarioCreadoDTO;

public interface IAuthServicio {

    UsuarioCreadoDTO crearUsuario(UsuarioAltaDTO dto);

    TokenResponse ingresar(InicioSolicitud request);

    TokenResponse refrescarToken(String authHeader);

    void cambiarClave(String nombreUsuario, CambiarClaveRequest dto);

    EstadoCuentaResponse estadoCuenta(String nombreUsuario);

    void validarNoEsCuentaPropia(Integer idUsuario, String usuarioActual, String mensaje);

    void revocarSesionesUsuario(Integer idUsuario);

}