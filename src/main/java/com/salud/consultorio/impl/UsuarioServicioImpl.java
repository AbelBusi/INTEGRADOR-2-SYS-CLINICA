package com.salud.consultorio.impl;

import com.salud.consultorio.auth.dto.rol.UsuarioRolDTO;
import com.salud.consultorio.dto.usuario.UsuarioListaDTO;
import com.salud.consultorio.dto.usuario.UsuarioListadoDTO;
import com.salud.consultorio.dto.usuario.UsuarioRespuestaDTO;
import com.salud.consultorio.model.enums.EntidadEstado;
import com.salud.consultorio.repository.IUsuarioRepositorio;
import com.salud.consultorio.service.IUsuarioServicio;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UsuarioServicioImpl implements IUsuarioServicio {

    private final IUsuarioRepositorio usuarioRepositorio;

    @Override
    public List<UsuarioRespuestaDTO> leerTodos() {
        return List.of();
    }

    @Transactional(readOnly = true)
    @Override
    public boolean existeUsuario(String usuario) {
        return usuarioRepositorio.existsByUsuario(usuario);
    }

    @Transactional(readOnly = true)
    @Override
    public boolean existeUsuarioPersona(Integer id) {
        return usuarioRepositorio.existeUsuarioPersona(id);
    }

    @Transactional(readOnly = true)
    @Override
    public Optional<UsuarioRolDTO> obtenerInformacionUsuarioYRol(Integer id) {
        return usuarioRepositorio.obtenerUsuarioYRolPorId(id);
    }

    @Transactional(readOnly = true)
    @Override
    public List<UsuarioListaDTO> listaUsuarios() {
        return null;
    }

    @Transactional(readOnly = true)
    @Override
    public List<UsuarioListaDTO> listaUsuariosActivos() {
        return null;
    }

    @Transactional(readOnly = true)
    @Override
    public List<UsuarioListaDTO> listaUsuariosInactivos() {
        return null;
    }

    @Transactional
    @Override
    public void eliminarPorId(Integer id) {
        usuarioRepositorio.UsuarioCambiarEstado(0,id);
    }

    @Override
    public void cambiarEstado(Integer id, EntidadEstado estado) {

    }

    @Override
    public List<UsuarioListadoDTO> lista(EntidadEstado estado) {
        return List.of();
    }

}