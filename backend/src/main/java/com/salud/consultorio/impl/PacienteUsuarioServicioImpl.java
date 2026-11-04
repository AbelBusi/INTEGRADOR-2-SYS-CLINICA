package com.salud.consultorio.impl;

import com.salud.consultorio.auth.service.IAuthServicio;
import com.salud.consultorio.dto.paciente.PacienteUsuarioEstadoDTO;
import com.salud.consultorio.dto.usuario.UsuarioAltaDTO;
import com.salud.consultorio.dto.usuario.UsuarioCreadoDTO;
import com.salud.consultorio.model.entity.Paciente;
import com.salud.consultorio.model.entity.Persona;
import com.salud.consultorio.model.enums.TipoUsuario;
import com.salud.consultorio.repository.IPacienteRepositorio;
import com.salud.consultorio.repository.IUsuarioRepositorio;
import com.salud.consultorio.service.IPacienteUsuarioServicio;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PacienteUsuarioServicioImpl implements IPacienteUsuarioServicio {

    private static final int ESTADO_ACTIVO = 1;

    private final IPacienteRepositorio pacienteRepositorio;
    private final IUsuarioRepositorio usuarioRepositorio;
    private final IAuthServicio authServicio;

    @Transactional(readOnly = true)
    @Override
    public List<PacienteUsuarioEstadoDTO> listarEstado() {
        return pacienteRepositorio.listarEstadoUsuario();
    }

    @Transactional
    @Override
    public UsuarioCreadoDTO registrarUsuario(Integer idPaciente) {

        if (idPaciente == null || idPaciente <= 0) {
            throw new IllegalArgumentException("El ID del paciente debe ser válido");
        }

        Paciente paciente = pacienteRepositorio.findById(idPaciente)
                .orElseThrow(() -> new EntityNotFoundException("No se encontró el paciente indicado"));

        Persona persona = paciente.getPersona();

        if (!Integer.valueOf(ESTADO_ACTIVO).equals(paciente.getEstado())
                || !Integer.valueOf(ESTADO_ACTIVO).equals(persona.getEstado())) {
            throw new IllegalArgumentException("Solo se puede registrar un usuario a un paciente activo");
        }

        if (persona.getCorreo() == null || persona.getCorreo().isBlank()) {
            throw new IllegalArgumentException(
                    "El paciente no tiene un correo registrado. Actualiza sus datos antes de crear el usuario"
            );
        }

        if (usuarioRepositorio.existeUsuarioPersona(persona.getId())) {
            throw new DataIntegrityViolationException("El paciente ya tiene una cuenta de usuario");
        }

        return authServicio.crearUsuario(new UsuarioAltaDTO(persona.getId(), TipoUsuario.PACIENTE, null));
    }
}