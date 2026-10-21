package com.salud.consultorio.impl;

import com.salud.consultorio.model.entity.Rol;
import com.salud.consultorio.model.entity.Usuario;
import com.salud.consultorio.repository.IRolRepositorio;
import com.salud.consultorio.repository.IUsuarioRepositorio;
import com.salud.consultorio.repository.IUsuarioRolRepositorio;
import com.salud.consultorio.service.IUsuarioRolReglasServicio;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UsuarioRolReglasServicioImpl implements IUsuarioRolReglasServicio {

    private static final String ROL_PACIENTE = "PACIENTE";

    private final IUsuarioRepositorio usuarioRepositorio;
    private final IRolRepositorio rolRepositorio;
    private final IUsuarioRolRepositorio usuarioRolRepositorio;

    @Transactional(readOnly = true)
    @Override
    public void validarAsignacion(Integer idUsuario, Integer idRol) {

        Usuario usuario = usuarioRepositorio.findById(idUsuario)
                .orElseThrow(() -> new EntityNotFoundException("No existe el usuario indicado"));

        Rol rol = rolRepositorio.findById(idRol)
                .orElseThrow(() -> new EntityNotFoundException("No existe el rol indicado"));

        validarRolAsignable(usuario.getPersona().getId(), rol);

        if (usuarioRolRepositorio.existeAsignacionActiva(idUsuario, idRol)) {
            throw new IllegalArgumentException("El usuario ya tiene el rol " + rol.getNombre());
        }

    }

    @Transactional(readOnly = true)
    @Override
    public void validarRevocacion(Integer idUsuario, Integer idRol) {

        Usuario usuario = usuarioRepositorio.findById(idUsuario)
                .orElseThrow(() -> new EntityNotFoundException("No existe el usuario indicado"));

        Rol rol = rolRepositorio.findById(idRol)
                .orElseThrow(() -> new EntityNotFoundException("No existe el rol indicado"));

        if (!usuarioRolRepositorio.existeAsignacionActiva(idUsuario, idRol)) {
            throw new EntityNotFoundException("El usuario no tiene asignado ese rol");
        }

        if (esRolPaciente(rol)
                && usuarioRolRepositorio.personaEsPacienteActivo(usuario.getPersona().getId())) {
            throw new IllegalArgumentException(
                    "El rol PACIENTE no se puede quitar mientras la persona esté registrada como paciente"
            );
        }

        if (usuarioRolRepositorio.contarAsignacionesActivas(idUsuario) <= 1) {
            throw new IllegalArgumentException("No puedes quitar el único rol activo de la cuenta");
        }

    }

    @Override
    public void validarRolAsignable(Integer idPersona, Rol rol) {

        if (!Integer.valueOf(1).equals(rol.getEstado())) {
            throw new IllegalArgumentException("El rol " + rol.getNombre() + " no está activo");
        }

        if (esRolPaciente(rol)) {
            if (!usuarioRolRepositorio.personaEsPacienteActivo(idPersona)) {
                throw new IllegalArgumentException(
                        "No se puede asignar el rol PACIENTE: la persona no está registrada como paciente"
                );
            }
            return;
        }

        if (!usuarioRolRepositorio.personaEsEmpleadoActivo(idPersona)) {
            throw new IllegalArgumentException(
                    "No se puede asignar el rol " + rol.getNombre() + ": la persona no está registrada como empleado"
            );
        }

    }

    private boolean esRolPaciente(Rol rol) {
        return ROL_PACIENTE.equalsIgnoreCase(rol.getNombre());
    }

}
