package com.salud.consultorio.impl;

import com.salud.consultorio.model.entity.Rol;
import com.salud.consultorio.model.entity.Usuario;
import com.salud.consultorio.model.entity.UsuarioRol;
import com.salud.consultorio.repository.IRolRepositorio;
import com.salud.consultorio.repository.IUsuarioRepositorio;
import com.salud.consultorio.repository.IUsuarioRolRepositorio;
import com.salud.consultorio.service.IUsuarioRolServicio;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UsuarioRolServicioImpl implements IUsuarioRolServicio {

    private static final int ESTADO_REVOCADO = 0;
    private static final int ESTADO_ACTIVO = 1;
    private static final String ROL_PACIENTE = "PACIENTE";

    private final IUsuarioRolRepositorio usuarioRolRepositorio;
    private final IUsuarioRepositorio usuarioRepositorio;
    private final IRolRepositorio rolRepositorio;

    @Transactional(readOnly = true)
    @Override
    public boolean existeUsuarioPorRol(Integer idRol) {
        return usuarioRolRepositorio.existsByRol_IdAndEstadoNot(idRol, ESTADO_REVOCADO);
    }

    @Transactional
    @Override
    public void revocarSesionesPorRol(Integer idRol) {
        usuarioRolRepositorio.revocarSesionesPorRol(idRol);
    }


    @Transactional
    @Override
    public void asignarRol(Integer idUsuario, Integer idRol) {

        if (idUsuario == null || idRol == null) {
            throw new IllegalArgumentException(
                    "El id del usuario y el id del rol son obligatorios."
            );
        }

        Usuario usuario = usuarioRepositorio.findById(idUsuario)
                .orElseThrow(() ->
                        new EntityNotFoundException("El usuario no existe.")
                );

        if (usuario.getEstado() == ESTADO_REVOCADO) {
            throw new IllegalArgumentException(
                    "No se pueden asignar roles a un usuario eliminado."
            );
        }

        Rol rol = rolRepositorio.findById(idRol)
                .orElseThrow(() ->
                        new EntityNotFoundException("El rol no existe.")
                );

        if (rol.getEstado() != ESTADO_ACTIVO) {
            throw new IllegalArgumentException(
                    "El rol no se encuentra activo."
            );
        }

        boolean esPaciente = usuarioRepositorio.esPaciente(idUsuario);
        boolean esEmpleado = usuarioRepositorio.esEmpleado(idUsuario);

        if (esPaciente && !esEmpleado) {
            throw new IllegalArgumentException(
                    "Un paciente no puede recibir roles adicionales."
            );
        }

        if (ROL_PACIENTE.equalsIgnoreCase(rol.getNombre())) {
            throw new IllegalArgumentException(
                    "No se puede asignar el rol PACIENTE mediante esta operación."
            );
        }

        if (!esEmpleado) {
            throw new IllegalArgumentException(
                    "Solo se pueden asignar roles adicionales a usuarios registrados como empleados."
            );
        }

        Optional<UsuarioRol> existente =
                usuarioRolRepositorio.findByUsuario_IdAndRol_Id(
                        idUsuario, idRol
                );

        if (existente.isPresent()) {

            UsuarioRol asignacion = existente.get();

            if (asignacion.getEstado() == ESTADO_ACTIVO) {
                throw new IllegalArgumentException(
                        "El usuario ya tiene asignado este rol."
                );
            }

            asignacion.setEstado(ESTADO_ACTIVO);
            return;
        }

        usuarioRolRepositorio.save(
                UsuarioRol.builder()
                        .usuario(usuario)
                        .rol(rol)
                        .build()
        );
    }

    @Transactional
    @Override
    public void revocarRol(Integer idUsuario, Integer idRol) {

        if (idUsuario == null || idRol == null) {
            throw new IllegalArgumentException("El id del usuario y el id del rol son obligatorios.");
        }

        UsuarioRol asignacion = usuarioRolRepositorio.findByUsuario_IdAndRol_Id(idUsuario, idRol).orElseThrow(
                () -> new EntityNotFoundException("El usuario no tiene asignado este rol.")
        );

        if (asignacion.getEstado() == ESTADO_REVOCADO) {
            throw new IllegalArgumentException("El rol ya se encuentra revocado para este usuario.");
        }

        long vigentes = usuarioRolRepositorio.countByUsuario_IdAndEstadoAndRol_Estado(
                idUsuario, ESTADO_ACTIVO, ESTADO_ACTIVO);

        if (vigentes <= 1) {
            throw new IllegalArgumentException("No se puede revocar el único rol activo del usuario.");
        }

        asignacion.setEstado(ESTADO_REVOCADO);
    }

}