package com.salud.consultorio.impl;

import com.salud.consultorio.auth.UsuarioAutenticadoProvider;
import com.salud.consultorio.model.entity.CitaMedica;
import com.salud.consultorio.model.entity.Diagnostico;
import com.salud.consultorio.model.entity.Empleado;
import com.salud.consultorio.model.entity.Medico;
import com.salud.consultorio.model.entity.Usuario;
import com.salud.consultorio.repository.ICitaMedicaRepositorio;
import com.salud.consultorio.repository.IDiagnosticoRepositorio;
import com.salud.consultorio.repository.IMedicoRepositorio;
import com.salud.consultorio.repository.IUsuarioRepositorio;
import com.salud.consultorio.service.IAtencionClinicaAccesoServicio;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
@RequiredArgsConstructor
public class AtencionClinicaAccesoServicioImpl implements IAtencionClinicaAccesoServicio {

    private static final int CITA_ELIMINADA = 0;
    private static final int CITA_PROGRAMADA = 1;
    private static final int CITA_CANCELADA = 2;
    private static final int CITA_ATENDIDA = 3;
    private static final int CITA_REPROGRAMADA = 4;

    private static final int ENTIDAD_ACTIVA = 1;
    private static final String ROL_MEDICO = "MEDICO";

    private final ICitaMedicaRepositorio citaMedicaRepositorio;
    private final IDiagnosticoRepositorio diagnosticoRepositorio;
    private final IMedicoRepositorio medicoRepositorio;
    private final IUsuarioRepositorio usuarioRepositorio;
    private final UsuarioAutenticadoProvider usuarioAutenticadoProvider;

    @Override
    public CitaMedica citaParaEscritura(Integer idCita) {

        Medico medico = obtenerMedicoAutenticado();

        CitaMedica cita = citaMedicaRepositorio.buscarPorIdBloqueado(idCita).orElseThrow(
                () -> new EntityNotFoundException("No se encuentra la cita médica")
        );

        validarPropiedad(cita, medico);
        validarEstadoParaRegistrar(cita);

        return cita;

    }

    @Override
    public CitaMedica citaParaLectura(Integer idCita) {

        Medico medico = obtenerMedicoAutenticado();

        CitaMedica cita = citaMedicaRepositorio.findById(idCita).orElseThrow(
                () -> new EntityNotFoundException("No se encuentra la cita médica")
        );

        validarPropiedad(cita, medico);

        if (cita.getEstado() == CITA_ELIMINADA) {
            throw new IllegalArgumentException("La cita médica se encuentra eliminada.");
        }

        return cita;

    }

    @Override
    public Diagnostico diagnosticoParaEscritura(Integer idDiagnostico) {

        Diagnostico diagnostico = obtenerDiagnosticoActivo(idDiagnostico);

        citaParaEscritura(diagnostico.getCitaMedica().getId());

        return diagnostico;

    }

    @Override
    public Diagnostico diagnosticoParaLectura(Integer idDiagnostico) {

        Diagnostico diagnostico = obtenerDiagnosticoActivo(idDiagnostico);

        citaParaLectura(diagnostico.getCitaMedica().getId());

        return diagnostico;

    }

    private Diagnostico obtenerDiagnosticoActivo(Integer idDiagnostico) {

        return diagnosticoRepositorio.findByIdAndEstado(idDiagnostico, ENTIDAD_ACTIVA).orElseThrow(
                () -> new EntityNotFoundException("No existe el diagnóstico")
        );

    }

    private void validarPropiedad(CitaMedica cita, Medico medico) {

        if (!Objects.equals(cita.getMedico().getId(), medico.getId())) {
            throw new AccessDeniedException("La cita médica no está asignada al médico autenticado.");
        }

    }

    private void validarEstadoParaRegistrar(CitaMedica cita) {

        switch (cita.getEstado()) {
            case CITA_PROGRAMADA, CITA_ATENDIDA -> { /* admite registro clínico */ }
            case CITA_ELIMINADA -> throw new IllegalArgumentException(
                    "No se puede registrar información clínica en una cita médica eliminada.");
            case CITA_CANCELADA -> throw new IllegalArgumentException(
                    "No se puede registrar información clínica en una cita médica cancelada.");
            case CITA_REPROGRAMADA -> throw new IllegalArgumentException(
                    "No se puede registrar información clínica en una cita médica reprogramada.");
            default -> throw new IllegalArgumentException("La cita médica tiene un estado desconocido.");
        }

    }

    private Medico obtenerMedicoAutenticado() {

        Usuario usuario = usuarioAutenticadoProvider.obtener();

        if (usuario.getEstado() != ENTIDAD_ACTIVA) {
            throw new AccessDeniedException("El usuario autenticado no se encuentra activo.");
        }

        if (!usuarioRepositorio.tieneRolActivo(usuario.getId(), ROL_MEDICO)) {
            throw new AccessDeniedException("El usuario autenticado no tiene el rol MEDICO activo.");
        }

        Medico medico = medicoRepositorio.findByEmpleado_Persona_Id(usuario.getPersona().getId()).orElseThrow(
                () -> new AccessDeniedException("El usuario autenticado no está asociado a un médico.")
        );

        Empleado empleado = medico.getEmpleado();

        if (medico.getEstado() != ENTIDAD_ACTIVA
                || empleado.getEstado() != ENTIDAD_ACTIVA
                || empleado.getPersona().getEstado() != ENTIDAD_ACTIVA) {
            throw new AccessDeniedException("El médico asociado al usuario no se encuentra activo.");
        }

        return medico;

    }

}