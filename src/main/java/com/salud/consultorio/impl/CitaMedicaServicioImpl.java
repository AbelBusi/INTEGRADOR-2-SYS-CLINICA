package com.salud.consultorio.impl;

import com.salud.consultorio.dto.citaMedica.CitaMedicaActualizarDTO;
import com.salud.consultorio.dto.citaMedica.CitaMedicaCrearDTO;
import com.salud.consultorio.dto.citaMedica.CitaMedicaRespuestaDTO;
import com.salud.consultorio.model.entity.CitaMedica;
import com.salud.consultorio.model.entity.Medico;
import com.salud.consultorio.model.entity.Paciente;
import com.salud.consultorio.model.entity.Usuario;
import com.salud.consultorio.repository.ICitaMedicaRepositorio;
import com.salud.consultorio.repository.IHorarioAtencionRepositorio;
import com.salud.consultorio.repository.IMedicoRepositorio;
import com.salud.consultorio.repository.IPacienteRepositorio;
import com.salud.consultorio.repository.IUsuarioRepositorio;
import com.salud.consultorio.service.ICitaMedicaServicio;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CitaMedicaServicioImpl implements ICitaMedicaServicio {

    private static final int CITA_ELIMINADA = 0;
    private static final int CITA_PROGRAMADA = 1;
    private static final int CITA_CANCELADA = 2;
    private static final int CITA_ATENDIDA = 3;
    private static final int CITA_REPROGRAMADA = 4;

    private static final int ENTIDAD_ACTIVA = 1;

    private final ICitaMedicaRepositorio citaMedicaRepositorio;
    private final IPacienteRepositorio pacienteRepositorio;
    private final IMedicoRepositorio medicoRepositorio;
    private final IUsuarioRepositorio usuarioRepositorio;
    private final IHorarioAtencionRepositorio horarioAtencionRepositorio;

    @Transactional(readOnly = true)
    @Override
    public List<CitaMedicaRespuestaDTO> lista(Integer estado) {

        if (estado != null && (estado < CITA_ELIMINADA || estado > CITA_REPROGRAMADA)) {
            throw new IllegalArgumentException(
                    "El estado debe ser 0 (eliminada), 1 (programada), 2 (cancelada), 3 (atendida) o 4 (reprogramada)."
            );
        }

        return citaMedicaRepositorio.listaPorEstado(estado);
    }

    @Transactional(readOnly = true)
    @Override
    public CitaMedicaRespuestaDTO entidadPorID(Integer id) {

        return citaMedicaRepositorio.buscarDetallePorId(id).orElseThrow(
                () -> new EntityNotFoundException("No existe la cita médica")
        );

    }

    @Transactional
    @Override
    public CitaMedicaRespuestaDTO crear(CitaMedicaCrearDTO dto) {

        validarDatosCita(dto.fechaCita(), dto.horaInicio(), dto.horaSalida(), dto.motivo());

        Paciente paciente = obtenerPacienteActivo(dto.idPaciente());
        Medico medico = obtenerMedicoActivoBloqueado(dto.idMedico());
        Usuario usuario = obtenerUsuarioActivo(dto.idUsuario());

        validarDisponibilidadMedico(medico, dto.fechaCita(), dto.horaInicio(), dto.horaSalida(), 0);

        CitaMedica cita = CitaMedica.builder()
                .paciente(paciente)
                .medico(medico)
                .usuario(usuario)
                .fechaCita(dto.fechaCita())
                .horaInicio(dto.horaInicio())
                .horaSalida(dto.horaSalida())
                .motivo(dto.motivo().trim())
                .estado(CITA_PROGRAMADA)
                .build();

        return toDto(citaMedicaRepositorio.save(cita));

    }

    @Transactional
    @Override
    public CitaMedicaRespuestaDTO actualizar(CitaMedicaActualizarDTO dto, Integer id) {

        CitaMedica cita = citaMedicaRepositorio.findById(id).orElseThrow(
                () -> new EntityNotFoundException("No se encuentra la cita médica")
        );

        validarCitaProgramada(cita, "editar");

        validarDatosCita(dto.fechaCita(), dto.horaInicio(), dto.horaSalida(), dto.motivo());

        Paciente paciente = obtenerPacienteActivo(dto.idPaciente());
        Medico medico = obtenerMedicoActivoBloqueado(dto.idMedico());
        Usuario usuario = obtenerUsuarioActivo(dto.idUsuario());

        validarDisponibilidadMedico(medico, dto.fechaCita(), dto.horaInicio(), dto.horaSalida(), cita.getId());

        cita.setPaciente(paciente);
        cita.setMedico(medico);
        cita.setUsuario(usuario);
        cita.setFechaCita(dto.fechaCita());
        cita.setHoraInicio(dto.horaInicio());
        cita.setHoraSalida(dto.horaSalida());
        cita.setMotivo(dto.motivo().trim());

        return toDto(cita);

    }

    @Transactional
    @Override
    public void cancelar(Integer id) {

        CitaMedica cita = citaMedicaRepositorio.findById(id).orElseThrow(
                () -> new EntityNotFoundException("No se encuentra la cita médica")
        );

        validarCitaProgramada(cita, "cancelar");

        cita.setEstado(CITA_CANCELADA);

    }

    @Transactional
    @Override
    public void eliminarPorId(Integer id) {

        CitaMedica cita = citaMedicaRepositorio.findById(id).orElseThrow(
                () -> new EntityNotFoundException("No se encuentra la cita médica")
        );

        if (cita.getEstado() == CITA_ELIMINADA) {
            throw new IllegalArgumentException("La cita médica ya se encuentra eliminada.");
        }

        cita.setEstado(CITA_ELIMINADA);

    }

    private void validarCitaProgramada(CitaMedica cita, String accion) {

        switch (cita.getEstado()) {
            case CITA_PROGRAMADA -> { /* válida */ }
            case CITA_ELIMINADA -> throw new IllegalArgumentException(
                    "No se puede " + accion + " una cita médica eliminada.");
            case CITA_CANCELADA -> throw new IllegalArgumentException(
                    "No se puede " + accion + " una cita médica cancelada.");
            case CITA_ATENDIDA -> throw new IllegalArgumentException(
                    "No se puede " + accion + " una cita médica que ya fue atendida.");
            case CITA_REPROGRAMADA -> throw new IllegalArgumentException(
                    "No se puede " + accion + " una cita médica que ya fue reprogramada.");
            default -> throw new IllegalArgumentException("La cita médica tiene un estado desconocido.");
        }

    }

    private void validarDatosCita(LocalDate fecha, LocalTime horaInicio, LocalTime horaSalida, String motivo) {

        if (fecha == null || horaInicio == null || horaSalida == null) {
            throw new IllegalArgumentException("La fecha, la hora de inicio y la hora de salida son obligatorias.");
        }

        if (fecha.isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("La fecha de la cita no puede ser una fecha pasada.");
        }

        if (!horaInicio.isBefore(horaSalida)) {
            throw new IllegalArgumentException("La hora de inicio debe ser anterior a la hora de salida.");
        }

        if (motivo == null || motivo.isBlank()) {
            throw new IllegalArgumentException("El motivo de la cita es obligatorio.");
        }

        if (motivo.trim().length() > 200) {
            throw new IllegalArgumentException("El motivo no puede superar los 200 caracteres.");
        }

    }

    private Paciente obtenerPacienteActivo(Integer idPaciente) {

        Paciente paciente = pacienteRepositorio.findById(idPaciente).orElseThrow(
                () -> new EntityNotFoundException("No existe el paciente")
        );

        if (paciente.getEstado() != ENTIDAD_ACTIVA) {
            throw new IllegalArgumentException("El paciente no se encuentra activo.");
        }

        return paciente;

    }

    private Medico obtenerMedicoActivoBloqueado(Integer idMedico) {

        Medico medico = medicoRepositorio.buscarPorIdBloqueado(idMedico).orElseThrow(
                () -> new EntityNotFoundException("No existe el médico")
        );

        if (medico.getEstado() != ENTIDAD_ACTIVA) {
            throw new IllegalArgumentException("El médico no se encuentra activo.");
        }

        return medico;

    }

    private Usuario obtenerUsuarioActivo(Integer idUsuario) {

        Usuario usuario = usuarioRepositorio.findById(idUsuario).orElseThrow(
                () -> new EntityNotFoundException("No existe el usuario")
        );

        if (usuario.getEstado() != ENTIDAD_ACTIVA) {
            throw new IllegalArgumentException("El usuario no se encuentra activo.");
        }

        return usuario;

    }

    private void validarDisponibilidadMedico(Medico medico, LocalDate fecha,
                                             LocalTime horaInicio, LocalTime horaSalida,
                                             Integer idExcluir) {

        Integer diaSemana = fecha.getDayOfWeek().getValue();

        boolean tieneHorario = horarioAtencionRepositorio.existeHorarioDisponible(
                medico.getEmpleado().getId(), diaSemana, horaInicio, horaSalida, fecha
        );

        if (!tieneHorario) {
            throw new IllegalArgumentException(
                    "El médico no tiene horario de atención disponible en la fecha y horas indicadas."
            );
        }

        boolean hayCruce = citaMedicaRepositorio.existeCruceCita(
                medico.getId(), fecha, horaInicio, horaSalida, idExcluir
        );

        if (hayCruce) {
            throw new DataIntegrityViolationException(
                    "El médico ya tiene una cita programada que se cruza con ese horario."
            );
        }

    }

    private CitaMedicaRespuestaDTO toDto(CitaMedica c) {

        var pp = c.getPaciente().getPersona();
        var mp = c.getMedico().getEmpleado().getPersona();

        return new CitaMedicaRespuestaDTO(
                c.getId(),
                c.getPaciente().getId(),
                pp.getNombre() + " " + pp.getApellidos(),
                c.getMedico().getId(),
                mp.getNombre() + " " + mp.getApellidos(),
                c.getUsuario().getId(),
                c.getFechaCita(),
                c.getHoraInicio(),
                c.getHoraSalida(),
                c.getMotivo(),
                c.getEstado()
        );

    }

}