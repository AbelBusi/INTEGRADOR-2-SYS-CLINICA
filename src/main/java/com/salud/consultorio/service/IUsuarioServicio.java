package com.salud.consultorio.service;

import com.salud.consultorio.auth.dto.rol.UsuarioRolDTO;
import com.salud.consultorio.dto.usuario.UsuarioListaDTO;
import com.salud.consultorio.dto.usuario.UsuarioRespuestaDTO;

import java.util.List;
import java.util.Optional;

public interface IUsuarioServicio {

    List<UsuarioRespuestaDTO> leerTodos();

    boolean existeUsuario(String usuario);

    boolean existeUsuarioPersona(Integer id);

    Optional<UsuarioRolDTO> obtenerInformacionUsuarioYRol(Integer id);

    List<UsuarioListaDTO> listaUsuarios();

    List<UsuarioListaDTO> listaUsuariosActivos();

    List<UsuarioListaDTO> listaUsuariosInactivos();

    void eliminarPorId(Integer id);

}