package com.salud.consultorio.auth.service;

import com.salud.consultorio.auth.dto.*;
import com.salud.consultorio.dto.usuario.UsuarioAltaDTO;
import com.salud.consultorio.dto.usuario.UsuarioCreadoDTO;

public interface IAuthServicio {

    UsuarioCreadoDTO crearUsuario(UsuarioAltaDTO dto);

    TokenResponse ingresar(InicioSolicitud request);

    TokenResponse refrescarToken(String authHeder);

    void cambiarClave(String nombreUsuario, CambiarClaveRequest dto);

    EstadoCuentaResponse estadoCuenta(String nombreUsuario);

}