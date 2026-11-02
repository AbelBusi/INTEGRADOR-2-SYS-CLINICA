package com.salud.consultorio.auth.service;

import com.salud.consultorio.auth.dto.CanalRecuperacion;

public interface IRecuperacionClaveServicio {
    void solicitarCodigo(String nombreUsuario, String numeroDocumento,
                         CanalRecuperacion canal, String destino);    void verificarCodigo(String usuario, String codigo);
    void restablecerClave(String usuario, String codigo, String nuevaClave);
}