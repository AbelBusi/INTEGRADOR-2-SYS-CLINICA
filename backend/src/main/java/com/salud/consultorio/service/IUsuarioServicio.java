package com.salud.consultorio.service;

import com.salud.consultorio.dto.usuario.UsuarioListadoDTO;
import com.salud.consultorio.dto.usuario.UsuarioRolesDTO;
import com.salud.consultorio.model.enums.EntidadEstado;

import java.util.List;

public interface IUsuarioServicio {

    boolean existeUsuario(String usuario);

    boolean existeUsuarioPersona(Integer id);

    UsuarioRolesDTO obtenerInformacionUsuarioYRol(Integer id);

    void eliminarPorId(Integer id);

    void cambiarEstado(Integer id, EntidadEstado estado);

    List<UsuarioListadoDTO> lista(EntidadEstado estado);

    List<UsuarioListadoDTO> listaEmpleados(EntidadEstado estado);

    List<UsuarioListadoDTO> listaPacientes(EntidadEstado estado);

}