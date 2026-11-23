package com.salud.consultorio.impl;

import com.salud.consultorio.auth.UsuarioAutenticadoProvider;
import com.salud.consultorio.model.entity.Empleado;
import com.salud.consultorio.model.entity.HistoriaClinica;
import com.salud.consultorio.model.entity.Medico;
import com.salud.consultorio.model.entity.Paciente;
import com.salud.consultorio.model.entity.Usuario;
import com.salud.consultorio.repository.IHistoriaClinicaRepositorio;
import com.salud.consultorio.repository.IMedicoRepositorio;
import com.salud.consultorio.repository.IPacienteRepositorio;
import com.salud.consultorio.repository.IUsuarioRepositorio;
import com.salud.consultorio.service.IHistoriaClinicaAccesoServicio;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class HistoriaClinicaAccesoServicioImpl implements IHistoriaClinicaAccesoServicio {

    private static final int ACTIVO = 1;
    private static final String ROL_MEDICO = "MEDICO";

    private final UsuarioAutenticadoProvider usuarioAutenticadoProvider;
    private final IUsuarioRepositorio usuarioRepositorio;
    private final IMedicoRepositorio medicoRepositorio;
    private final IPacienteRepositorio pacienteRepositorio;
    private final IHistoriaClinicaRepositorio historiaClinicaRepositorio;

    @Transactional(readOnly = true)
    @Override
    public Paciente pacienteTitular() {

        Usuario usuario = usuarioAutenticadoProvider.obtener();

        if (usuario.getEstado() != ACTIVO) {
            throw new AccessDeniedException("El usuario autenticado no se encuentra activo.");
        }

        Paciente paciente = pacienteRepositorio.findByPersona_Id(usuario.getPersona().getId()).orElseThrow(
                () -> new AccessDeniedException("El usuario autenticado no está asociado a un paciente.")
        );

        if (paciente.getEstado() != ACTIVO || paciente.getPersona().getEstado() != ACTIVO) {
            throw new AccessDeniedException("El paciente asociado al usuario no se encuentra activo.");
        }

        return paciente;

    }

    @Transactional(readOnly = true)
    @Override
    public Medico medicoAutorizadoPara(Integer idPaciente) {

        Medico medico = medicoAutenticado();

        if (!historiaClinicaRepositorio.existeRelacionAsistencial(medico.getId(), idPaciente)) {
            throw new AccessDeniedException("No tiene una relación asistencial autorizada con este paciente.");
        }

        return medico;

    }

    @Transactional(readOnly = true)
    @Override
    public HistoriaClinica historiaParaEscritura(Integer idHistoria) {

        HistoriaClinica historia = historiaClinicaRepositorio.findById(idHistoria).orElseThrow(
                () -> new EntityNotFoundException("No existe la historia clínica")
        );

        medicoAutorizadoPara(historia.getPaciente().getId());

        if (historia.getEstado() != ACTIVO) {
            throw new IllegalArgumentException("La historia clínica no se encuentra activa.");
        }

        return historia;

    }

    @Override
    public Medico medicoAutenticado() {

        Usuario usuario = usuarioAutenticadoProvider.obtener();

        if (usuario.getEstado() != ACTIVO) {
            throw new AccessDeniedException("El usuario autenticado no se encuentra activo.");
        }

        if (!usuarioRepositorio.tieneRolActivo(usuario.getId(), ROL_MEDICO)) {
            throw new AccessDeniedException("El usuario autenticado no tiene el rol MEDICO activo.");
        }

        Medico medico = medicoRepositorio.findByEmpleado_Persona_Id(usuario.getPersona().getId()).orElseThrow(
                () -> new AccessDeniedException("El usuario autenticado no está asociado a un médico.")
        );

        Empleado empleado = medico.getEmpleado();

        if (medico.getEstado() != ACTIVO
                || empleado.getEstado() != ACTIVO
                || empleado.getPersona().getEstado() != ACTIVO) {
            throw new AccessDeniedException("El médico asociado al usuario no se encuentra activo.");
        }

        return medico;

    }

}