package com.salud.consultorio.impl;

import com.salud.consultorio.auth.UsuarioAutenticadoProvider;
import com.salud.consultorio.dto.citaMedica.CitaMedicaActualizarDTO;
import com.salud.consultorio.dto.citaMedica.CitaMedicaCrearDTO;
import com.salud.consultorio.dto.citaMedica.CitaMedicaRespuestaDTO;
import com.salud.consultorio.model.entity.CitaMedica;
import com.salud.consultorio.model.entity.Empleado;
import com.salud.consultorio.model.entity.Medico;
import com.salud.consultorio.model.entity.Paciente;
import com.salud.consultorio.model.entity.Usuario;
import com.salud.consultorio.model.enums.AccionHistorialCita;
import com.salud.consultorio.model.enums.ResolucionRegularizacion;
import com.salud.consultorio.repository.ICitaMedicaRepositorio;
import com.salud.consultorio.repository.IHorarioAtencionRepositorio;
import com.salud.consultorio.repository.IMedicoRepositorio;
import com.salud.consultorio.repository.IPacienteRepositorio;
import com.salud.consultorio.repository.IUsuarioRepositorio;
import com.salud.consultorio.service.ICitaMedicaServicio;
import com.salud.consultorio.service.IHistorialCitaServicio;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.*;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class CitaMedicaServicioImpl implements ICitaMedicaServicio {

    private static final int CITA_ELIMINADA = 0;
    private static final int CITA_PROGRAMADA = 1;
    private static final int CITA_CANCELADA = 2;
    private static final int CITA_ATENDIDA = 3;
    private static final int CITA_REPROGRAMADA = 4;

    private static final int ENTIDAD_ACTIVA = 1;

    private static final String ROL_MEDICO = "MEDICO";

    private static final Duration PLAZO_REGULARIZACION = Duration.ofHours(24);

    private final ICitaMedicaRepositorio citaMedicaRepositorio;
    private final IPacienteRepositorio pacienteRepositorio;
    private final IMedicoRepositorio medicoRepositorio;
    private final IUsuarioRepositorio usuarioRepositorio;
    private final IHorarioAtencionRepositorio horarioAtencionRepositorio;
    private final IHistorialCitaServicio historialCitaServicio;
    private final UsuarioAutenticadoProvider usuarioAutenticadoProvider;
    private static final Duration LIMITE_CANCELACION = Duration.ofHours(2);
    private final Clock clock;
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
    public List<Integer> idsVencidasParaCancelacionAutomatica() {

        LocalDateTime limite = LocalDateTime.now(clock).minus(PLAZO_REGULARIZACION);

        return citaMedicaRepositorio.listaIdsVencidasHasta(limite.toLocalDate(), limite.toLocalTime());

    }

    @Transactional
    @Override
    public void cancelarAutomaticamentePorVencimiento(Integer id) {

        CitaMedica cita = citaMedicaRepositorio.buscarPorIdBloqueado(id).orElse(null);

        if (cita == null || cita.getEstado() != CITA_PROGRAMADA) {
            return;
        }

        if (!plazoRegularizacionVencido(cita, LocalDateTime.now(clock))) {
            return;
        }

        Map<String, Object> anteriores = new LinkedHashMap<>();
        anteriores.put("estado", cita.getEstado());

        Map<String, Object> nuevos = new LinkedHashMap<>();
        nuevos.put("estado", CITA_CANCELADA);
        nuevos.put("cancelacionAutomatica", true);

        cita.setEstado(CITA_CANCELADA);

        historialCitaServicio.registrarSistema(
                cita,
                AccionHistorialCita.CANCELADA,
                anteriores,
                nuevos,
                "Cancelada automáticamente: no se regularizó dentro de las 24 horas posteriores a su finalización."
        );

    }

    private boolean plazoRegularizacionVencido(CitaMedica cita, LocalDateTime ahora) {
        LocalDateTime fin = LocalDateTime.of(cita.getFechaCita(), cita.getHoraSalida());
        return !ahora.isBefore(fin.plus(PLAZO_REGULARIZACION));
    }

    private void validarPlazoRegularizacion(CitaMedica cita) {
        if (plazoRegularizacionVencido(cita, LocalDateTime.now(clock))) {
            throw new IllegalArgumentException(
                    "Venció el plazo de 24 horas para regularizar esta cita; se cancelará automáticamente.");
        }
    }

    @Transactional(readOnly = true)
    @Override
    public List<CitaMedicaRespuestaDTO> listaMisCitasMedico(Integer estado) {

        validarEstadoConsulta(estado);

        Medico medico = obtenerMedicoAutenticado();

        return citaMedicaRepositorio.listaPorMedico(medico.getId(), estado);

    }

    @Transactional(readOnly = true)
    @Override
    public List<CitaMedicaRespuestaDTO> listaMisCitasPaciente(Integer estado) {

        validarEstadoConsulta(estado);

        Paciente paciente = obtenerPacienteAutenticado();

        return citaMedicaRepositorio.listaPorPaciente(paciente.getId(), estado);

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

        validarPacienteDistintoDeMedico(paciente, medico);
        validarDisponibilidadMedico(medico, dto.fechaCita(), dto.horaInicio(), dto.horaSalida(), 0);
        validarDisponibilidadPaciente(paciente, dto.fechaCita(), dto.horaInicio(), dto.horaSalida(), 0);

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

        CitaMedica guardada = citaMedicaRepositorio.save(cita);

        historialCitaServicio.registrar(guardada, AccionHistorialCita.CREADA, null, snapshot(guardada), null);

        return toDto(guardada);

    }

    @Transactional
    @Override
    public CitaMedicaRespuestaDTO actualizar(CitaMedicaActualizarDTO dto, Integer id) {

        CitaMedica cita = obtenerCitaBloqueada(id);

        validarCitaProgramada(cita, "editar");

        validarDatosCita(dto.fechaCita(), dto.horaInicio(), dto.horaSalida(), dto.motivo());

        Paciente paciente = obtenerPacienteActivo(dto.idPaciente());
        Medico medico = obtenerMedicoActivoBloqueado(dto.idMedico());
        Usuario usuario = obtenerUsuarioActivo(dto.idUsuario());
        validarPacienteDistintoDeMedico(paciente, medico);
        String motivo = dto.motivo().trim();

        boolean cambioAgenda = !Objects.equals(cita.getMedico().getId(), medico.getId())
                || !cita.getFechaCita().equals(dto.fechaCita())
                || !cita.getHoraInicio().equals(dto.horaInicio())
                || !cita.getHoraSalida().equals(dto.horaSalida());

        boolean cambioAdministrativo = !Objects.equals(cita.getPaciente().getId(), paciente.getId())
                || !Objects.equals(cita.getUsuario().getId(), usuario.getId())
                || !cita.getMotivo().equals(motivo);

        boolean cambioPaciente = !Objects.equals(cita.getPaciente().getId(), paciente.getId());

        if (!cambioAgenda && !cambioAdministrativo) {
            return toDto(cita);
        }

        if (cambioAgenda) {
            validarDisponibilidadMedico(medico, dto.fechaCita(), dto.horaInicio(), dto.horaSalida(), cita.getId());
        }

        if (cambioAgenda || cambioPaciente) {
            validarDisponibilidadPaciente(paciente, dto.fechaCita(), dto.horaInicio(), dto.horaSalida(), cita.getId());
        }

        Map<String, Object> anteriores = new LinkedHashMap<>();
        Map<String, Object> nuevos = new LinkedHashMap<>();

        registrarCambio("idPaciente", cita.getPaciente().getId(), paciente.getId(), anteriores, nuevos);
        registrarCambio("idMedico", cita.getMedico().getId(), medico.getId(), anteriores, nuevos);
        registrarCambio("idUsuario", cita.getUsuario().getId(), usuario.getId(), anteriores, nuevos);
        registrarCambio("fechaCita", cita.getFechaCita().toString(), dto.fechaCita().toString(), anteriores, nuevos);
        registrarCambio("horaInicio", cita.getHoraInicio().toString(), dto.horaInicio().toString(), anteriores, nuevos);
        registrarCambio("horaSalida", cita.getHoraSalida().toString(), dto.horaSalida().toString(), anteriores, nuevos);
        registrarCambio("motivo", cita.getMotivo(), motivo, anteriores, nuevos);

        cita.setPaciente(paciente);
        cita.setMedico(medico);
        cita.setUsuario(usuario);
        cita.setFechaCita(dto.fechaCita());
        cita.setHoraInicio(dto.horaInicio());
        cita.setHoraSalida(dto.horaSalida());
        cita.setMotivo(motivo);

        AccionHistorialCita accion = cambioAgenda
                ? AccionHistorialCita.REPROGRAMADA
                : AccionHistorialCita.MODIFICADA;

        historialCitaServicio.registrar(cita, accion, anteriores, nuevos, null);

        return toDto(cita);

    }

    @Transactional
    @Override
    public void cancelar(Integer id, String observacion) {

        CitaMedica cita = obtenerCitaBloqueada(id);

        validarCitaProgramada(cita, "cancelar");
        validarVentanaCancelacion(cita);

        String detalle = normalizarObservacion(observacion);

        aplicarResolucion(cita, CITA_CANCELADA, AccionHistorialCita.CANCELADA, detalle, false);

    }

    @Transactional
    @Override
    public void atender(Integer id, String observacion) {

        CitaMedica cita = obtenerCitaBloqueada(id);

        validarCitaProgramada(cita, "atender");
        validarPlazoRegularizacion(cita);
        String detalle = normalizarObservacion(observacion);

        aplicarResolucion(cita, CITA_ATENDIDA, AccionHistorialCita.ATENDIDA, detalle, false);

    }

    @Transactional(readOnly = true)
    @Override
    public List<CitaMedicaRespuestaDTO> listaPendientesRegularizacion() {

        LocalDateTime ahora = LocalDateTime.now(clock);

        return citaMedicaRepositorio.listaPendientesRegularizacion(null, ahora.toLocalDate(), ahora.toLocalTime());

    }

    @Transactional(readOnly = true)
    @Override
    public List<CitaMedicaRespuestaDTO> listaMisPendientesRegularizacionMedico() {

        Medico medico = obtenerMedicoAutenticado();
        LocalDateTime ahora = LocalDateTime.now(clock);

        return citaMedicaRepositorio.listaPendientesRegularizacion(
                medico.getId(), ahora.toLocalDate(), ahora.toLocalTime());

    }

    @Transactional
    @Override
    public void regularizar(Integer id, ResolucionRegularizacion resolucion, String observacion) {

        CitaMedica cita = obtenerCitaBloqueada(id);

        validarCitaProgramada(cita, "regularizar");

        if (!horarioFinalizado(cita, LocalDateTime.now(clock))) {
            throw new IllegalArgumentException(
                    "La cita aún no ha finalizado, por lo que no está pendiente de regularización.");
        }

        validarPlazoRegularizacion(cita);

        String justificacion = normalizarObservacion(observacion);

        if (justificacion == null) {
            throw new IllegalArgumentException("La justificación es obligatoria para regularizar una cita vencida.");
        }

        if (resolucion == null) {
            throw new IllegalArgumentException("La resolución es obligatoria.");
        }

        if (resolucion == ResolucionRegularizacion.ATENDIDA) {
            aplicarResolucion(cita, CITA_ATENDIDA, AccionHistorialCita.ATENDIDA, justificacion, true);
        } else {
            aplicarResolucion(cita, CITA_CANCELADA, AccionHistorialCita.CANCELADA, justificacion, true);
        }

    }

    @Transactional
    @Override
    public void eliminarPorId(Integer id) {

        CitaMedica cita = obtenerCitaBloqueada(id);

        if (cita.getEstado() == CITA_ELIMINADA) {
            throw new IllegalArgumentException("La cita médica ya se encuentra eliminada.");
        }

        Integer estadoAnterior = cita.getEstado();

        cita.setEstado(CITA_ELIMINADA);

        historialCitaServicio.registrar(cita, AccionHistorialCita.ELIMINADA,
                Map.of("estado", estadoAnterior), Map.of("estado", CITA_ELIMINADA), null);

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

    private Paciente obtenerPacienteAutenticado() {

        Usuario usuario = usuarioAutenticadoProvider.obtener();

        if (usuario.getEstado() != ENTIDAD_ACTIVA) {
            throw new AccessDeniedException("El usuario autenticado no se encuentra activo.");
        }

        Paciente paciente = pacienteRepositorio.findByPersona_Id(usuario.getPersona().getId()).orElseThrow(
                () -> new AccessDeniedException("El usuario autenticado no está asociado a un paciente.")
        );

        if (paciente.getEstado() != ENTIDAD_ACTIVA || paciente.getPersona().getEstado() != ENTIDAD_ACTIVA) {
            throw new AccessDeniedException("El paciente asociado al usuario no se encuentra activo.");
        }

        return paciente;

    }

    private void validarEstadoConsulta(Integer estado) {

        if (estado != null && (estado < CITA_PROGRAMADA || estado > CITA_REPROGRAMADA)) {
            throw new IllegalArgumentException(
                    "El estado debe ser 1 (programada), 2 (cancelada), 3 (atendida) o 4 (reprogramada)."
            );
        }

    }

    private CitaMedica obtenerCitaBloqueada(Integer id) {

        return citaMedicaRepositorio.buscarPorIdBloqueado(id).orElseThrow(
                () -> new EntityNotFoundException("No se encuentra la cita médica")
        );

    }

    private String normalizarObservacion(String observacion) {

        if (observacion == null || observacion.isBlank()) {
            return null;
        }

        String limpia = observacion.trim();

        if (limpia.length() > 300) {
            throw new IllegalArgumentException("La observación no puede superar los 300 caracteres.");
        }

        return limpia;

    }

    private Map<String, Object> snapshot(CitaMedica c) {

        Map<String, Object> datos = new LinkedHashMap<>();

        datos.put("idPaciente", c.getPaciente().getId());
        datos.put("idMedico", c.getMedico().getId());
        datos.put("idUsuario", c.getUsuario().getId());
        datos.put("fechaCita", c.getFechaCita().toString());
        datos.put("horaInicio", c.getHoraInicio().toString());
        datos.put("horaSalida", c.getHoraSalida().toString());
        datos.put("motivo", c.getMotivo());
        datos.put("estado", c.getEstado());

        return datos;

    }

    private void registrarCambio(String campo, Object anterior, Object nuevo,
                                 Map<String, Object> anteriores, Map<String, Object> nuevos) {

        if (!Objects.equals(anterior, nuevo)) {
            anteriores.put(campo, anterior);
            nuevos.put(campo, nuevo);
        }

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

        if (fecha.isBefore(LocalDate.now(clock))) {
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

    private void validarPacienteDistintoDeMedico(Paciente paciente, Medico medico) {

        Integer idPersonaPaciente = paciente.getPersona().getId();
        Integer idPersonaMedico = medico.getEmpleado().getPersona().getId();

        if (Objects.equals(idPersonaPaciente, idPersonaMedico)) {
            throw new IllegalArgumentException("El paciente y el médico no pueden ser la misma persona.");
        }

    }

    private void validarDisponibilidadPaciente(Paciente paciente, LocalDate fecha,
                                               LocalTime horaInicio, LocalTime horaSalida,
                                               Integer idExcluir) {

        if (citaMedicaRepositorio.existeCrucePaciente(paciente.getId(), fecha, horaInicio, horaSalida, idExcluir)) {
            throw new DataIntegrityViolationException(
                    "El paciente ya tiene una cita programada que se cruza con ese horario."
            );
        }

    }

    private void validarVentanaCancelacion(CitaMedica cita) {

        LocalDateTime ahora = LocalDateTime.now(clock);

        if (horarioFinalizado(cita, ahora)) {
            throw new IllegalArgumentException(
                    "No se puede cancelar una cita cuyo horario de atención ya finalizó. Debe regularizarse indicando lo ocurrido.");
        }

        LocalDateTime inicio = LocalDateTime.of(cita.getFechaCita(), cita.getHoraInicio());

        if (!ahora.isBefore(inicio.minus(LIMITE_CANCELACION))) {
            throw new IllegalArgumentException(
                    "No se puede cancelar una cita cuando faltan dos horas o menos para su inicio.");
        }

    }

    private boolean horarioFinalizado(CitaMedica cita, LocalDateTime ahora) {
        return !ahora.isBefore(LocalDateTime.of(cita.getFechaCita(), cita.getHoraSalida()));
    }

    private void aplicarResolucion(CitaMedica cita, int estadoNuevo, AccionHistorialCita accion,
                                   String observacion, boolean regularizacion) {

        Map<String, Object> anteriores = new LinkedHashMap<>();
        anteriores.put("estado", cita.getEstado());

        Map<String, Object> nuevos = new LinkedHashMap<>();
        nuevos.put("estado", estadoNuevo);

        if (regularizacion) {
            nuevos.put("regularizacion", true);
        }

        cita.setEstado(estadoNuevo);

        historialCitaServicio.registrar(cita, accion, anteriores, nuevos, observacion);

    }

}