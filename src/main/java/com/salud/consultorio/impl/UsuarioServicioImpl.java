package com.salud.consultorio.impl;

import com.salud.consultorio.auth.dto.rol.UsuarioRolDTO;
import com.salud.consultorio.dto.especialidad.EspecialidadRespuestaDTO;
import com.salud.consultorio.dto.usuario.UsuarioListaDTO;
import com.salud.consultorio.dto.usuario.UsuarioListadoDTO;
import com.salud.consultorio.dto.usuario.UsuarioRespuestaDTO;
import com.salud.consultorio.model.entity.Especialidad;
import com.salud.consultorio.model.entity.Usuario;
import com.salud.consultorio.model.enums.EntidadEstado;
import com.salud.consultorio.repository.IUsuarioRepositorio;
import com.salud.consultorio.service.IUsuarioServicio;
import jakarta.persistence.EntityNotFoundException;
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

    @Transactional
    @Override
    public void cambiarEstado(Integer id, EntidadEstado estado) {

        Usuario usuario = validarCambiarEstado(id, estado);

        if (usuario.getEstado() == 0) {
            throw new IllegalArgumentException("No se puede cambiar el estado de un cargo eliminado.");
        }

        if (estado == EntidadEstado.ACTIVO) {

            if (usuario.getEstado() == 1) {
                throw new IllegalArgumentException("No se puede activar un estado que ya se encuentra Activo");
            }

            usuarioRepositorio.activarLogicamente(usuario.getId());

        }

        if (estado == EntidadEstado.INACTIVO) {

            if (usuario.getEstado() == 2) {
                throw new IllegalArgumentException("No se puede desactivar un estado que ya se encuentra desactivado");
            }

            usuarioRepositorio.desactivarLogicamente(usuario.getId());

        }

    }

    @Transactional(readOnly = true)
    @Override
    public List<UsuarioListadoDTO> lista(EntidadEstado estado) {
        return listaPorEstado(estado);
    }

    @Transactional(readOnly = true)
    @Override
    public List<UsuarioListadoDTO> listaEmpleados(EntidadEstado estado) {
        return listaPorEstadoEmpleados(estado);
    }

    @Transactional(readOnly = true)
    @Override
    public List<UsuarioListadoDTO> listaPacientes(EntidadEstado estado) {
        return listaPorEstadoPacientes(estado);
    }

    @Transactional(readOnly = true)
    @Override
    public boolean existeUsuarioPorRol(Integer idRol) {
        return usuarioRepositorio.existsByRolId(idRol);
    }

    @Transactional(readOnly = true)
    private Usuario validarCambiarEstado(Integer id, EntidadEstado estado) {

        if (id == null || estado == null) {
            throw new IllegalArgumentException("El id y el estado son obligatorios.");
        }

        return usuarioRepositorio.findById(id).orElseThrow(
                () -> new EntityNotFoundException("El estado que desea cambiarle el estado, no existe.")
        );

    }

    @Transactional(readOnly = true)
    private List<UsuarioListadoDTO> listaPorEstado(EntidadEstado estado) {

        if (estado != null) {

            if (estado == EntidadEstado.ACTIVO) {

                return usuarioRepositorio.listarUsuariosPorEstado(1);

            }

            if (estado == EntidadEstado.INACTIVO) {

                return usuarioRepositorio.listarUsuariosPorEstado(2);

            }

        }

        return usuarioRepositorio.listarUsuarios();

    }

    @Transactional(readOnly = true)
    private List<UsuarioListadoDTO> listaPorEstadoEmpleados(EntidadEstado estado) {

        if (estado != null) {

            if (estado == EntidadEstado.ACTIVO) {

                return usuarioRepositorio.listarUsuariosEmpleados(1);

            }

            if (estado == EntidadEstado.INACTIVO) {

                return usuarioRepositorio.listarUsuariosEmpleados(2);

            }

        }

        return usuarioRepositorio.listarUsuariosEmpleados(null);

    }

    @Transactional(readOnly = true)
    private List<UsuarioListadoDTO> listaPorEstadoPacientes(EntidadEstado estado) {

        if (estado != null) {

            if (estado == EntidadEstado.ACTIVO) {

                return usuarioRepositorio.listarUsuariosPacientes(1);

            }

            if (estado == EntidadEstado.INACTIVO) {

                return usuarioRepositorio.listarUsuariosPacientes(2);

            }

        }

        return usuarioRepositorio.listarUsuariosPacientes(null);

    }

}