package com.salud.consultorio.impl;

import com.salud.consultorio.auth.dto.rol.RolResumenDTO;
import com.salud.consultorio.dto.usuario.UsuarioBaseDTO;
import com.salud.consultorio.dto.usuario.UsuarioListadoDTO;
import com.salud.consultorio.dto.usuario.UsuarioRolAsignadoDTO;
import com.salud.consultorio.dto.usuario.UsuarioRolesDTO;
import com.salud.consultorio.model.entity.Usuario;
import com.salud.consultorio.model.enums.EntidadEstado;
import com.salud.consultorio.repository.IUsuarioRepositorio;
import com.salud.consultorio.repository.IUsuarioRolRepositorio;
import com.salud.consultorio.service.IUsuarioServicio;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UsuarioServicioImpl implements IUsuarioServicio {

    private static final int ESTADO_ELIMINADO = 0;
    private static final int ESTADO_ACTIVO = 1;
    private static final int ESTADO_INACTIVO = 2;

    private final IUsuarioRepositorio usuarioRepositorio;
    private final IUsuarioRolRepositorio usuarioRolRepositorio;

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
    public UsuarioRolesDTO obtenerInformacionUsuarioYRol(Integer id) {

        Usuario usuario = usuarioRepositorio.findById(id).orElseThrow(
                () -> new EntityNotFoundException("El usuario no existe.")
        );

        List<RolResumenDTO> roles = rolesPorUsuarios(List.of(id)).getOrDefault(id, List.of());

        String nombreCompleto = usuario.getPersona().getNombre() + " " + usuario.getPersona().getApellidos();

        return new UsuarioRolesDTO(usuario.getId(), usuario.getUsuario(), nombreCompleto, roles);
    }

    @Transactional
    @Override
    public void eliminarPorId(Integer id) {
        usuarioRepositorio.UsuarioCambiarEstado(ESTADO_ELIMINADO, id);
    }

    @Transactional
    @Override
    public void cambiarEstado(Integer id, EntidadEstado estado) {

        if (id == null || estado == null) {
            throw new IllegalArgumentException("El id y el estado son obligatorios.");
        }

        Usuario usuario = usuarioRepositorio.findById(id).orElseThrow(
                () -> new EntityNotFoundException("El usuario al que desea cambiarle el estado no existe.")
        );

        if (usuario.getEstado() == ESTADO_ELIMINADO) {
            throw new IllegalArgumentException("No se puede cambiar el estado de un usuario eliminado.");
        }

        if (estado == EntidadEstado.ACTIVO) {

            if (usuario.getEstado() == ESTADO_ACTIVO) {
                throw new IllegalArgumentException("El usuario ya se encuentra activo.");
            }

            usuarioRepositorio.UsuarioCambiarEstado(ESTADO_ACTIVO, usuario.getId());

        } else if (estado == EntidadEstado.INACTIVO) {

            if (usuario.getEstado() == ESTADO_INACTIVO) {
                throw new IllegalArgumentException("El usuario ya se encuentra inactivo.");
            }

            usuarioRepositorio.UsuarioCambiarEstado(ESTADO_INACTIVO, usuario.getId());
        }

    }

    @Transactional(readOnly = true)
    @Override
    public List<UsuarioListadoDTO> lista(EntidadEstado estado) {
        return conRoles(usuarioRepositorio.listarUsuarios(aCodigo(estado)));
    }

    @Transactional(readOnly = true)
    @Override
    public List<UsuarioListadoDTO> listaEmpleados(EntidadEstado estado) {
        return conRoles(usuarioRepositorio.listarUsuariosEmpleados(aCodigo(estado)));
    }

    @Transactional(readOnly = true)
    @Override
    public List<UsuarioListadoDTO> listaPacientes(EntidadEstado estado) {
        return conRoles(usuarioRepositorio.listarUsuariosPacientes(aCodigo(estado)));
    }

    private Integer aCodigo(EntidadEstado estado) {
        if (estado == EntidadEstado.ACTIVO) return ESTADO_ACTIVO;
        if (estado == EntidadEstado.INACTIVO) return ESTADO_INACTIVO;
        return null;
    }

    private List<UsuarioListadoDTO> conRoles(List<UsuarioBaseDTO> usuarios) {

        if (usuarios.isEmpty()) {
            return List.of();
        }

        List<Integer> ids = usuarios.stream().map(UsuarioBaseDTO::id).toList();
        Map<Integer, List<RolResumenDTO>> roles = rolesPorUsuarios(ids);

        return usuarios.stream()
                .map(u -> new UsuarioListadoDTO(
                        u.id(),
                        u.usuario(),
                        u.nombreCompleto(),
                        u.numeroDocumento(),
                        u.estado(),
                        roles.getOrDefault(u.id(), List.of())
                ))
                .toList();
    }

    private Map<Integer, List<RolResumenDTO>> rolesPorUsuarios(Collection<Integer> ids) {
        return usuarioRolRepositorio.listarRolesActivosPorUsuarios(ids).stream()
                .collect(Collectors.groupingBy(
                        UsuarioRolAsignadoDTO::idUsuario,
                        Collectors.mapping(
                                a -> new RolResumenDTO(a.idRol(), a.nombreRol()),
                                Collectors.toList()
                        )
                ));
    }

}