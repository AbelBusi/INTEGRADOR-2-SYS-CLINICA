package com.backend.salud.impl;

import com.backend.salud.dto.usuario.UsuarioDetalleLeerDTO;
import com.backend.salud.dto.usuario.UsuarioListaDTO;
import com.backend.salud.dto.usuario.UsuarioRespuestaDTO;
import com.backend.salud.dto.usuario.UsuarioRolDTO;
import com.backend.salud.repository.IUsuarioRepositorio;
import com.backend.salud.service.IUsuarioServicio;
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
    public Optional<UsuarioDetalleLeerDTO> obtenerDetallePorId(Integer id) {
        return usuarioRepositorio.obtenerDetallePorId(id);
    }

    @Transactional(readOnly = true)
    @Override
    public List<UsuarioListaDTO> listaUsuarios() {
        return usuarioRepositorio.todosUsuarios();
    }

    @Transactional(readOnly = true)
    @Override
    public List<UsuarioListaDTO> listaUsuariosActivos() {
        return usuarioRepositorio.todosUsuariosActivos();
    }

    @Transactional(readOnly = true)
    @Override
    public List<UsuarioListaDTO> listaUsuariosInactivos() {
        return usuarioRepositorio.todosUsuariosInactivos();
    }

    @Transactional
    @Override
    public void eliminarPorId(Integer id) {
        usuarioRepositorio.UsuarioCambiarEstado(0,id);
    }

}