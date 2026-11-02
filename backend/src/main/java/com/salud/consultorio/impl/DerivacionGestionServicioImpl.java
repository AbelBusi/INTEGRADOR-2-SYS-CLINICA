package com.salud.consultorio.impl;

import com.salud.consultorio.dto.citaMedica.CitaMedicaCrearDTO;
import com.salud.consultorio.dto.citaMedica.CitaMedicaRespuestaDTO;
import com.salud.consultorio.dto.derivacion.DerivacionGestionRespuestaDTO;
import com.salud.consultorio.model.entity.CitaMedica;
import com.salud.consultorio.model.entity.Derivacion;
import com.salud.consultorio.model.entity.Medico;
import com.salud.consultorio.model.entity.Persona;
import com.salud.consultorio.repository.IDerivacionRepositorio;
import com.salud.consultorio.repository.IMedicoRepositorio;
import com.salud.consultorio.service.ICitaMedicaServicio;
import com.salud.consultorio.service.IDerivacionGestionServicio;
import com.salud.consultorio.util.EstadoDerivacion;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class DerivacionGestionServicioImpl implements IDerivacionGestionServicio {

    private static final String PREFIJO_CODIGO = "DER-";
    private static final Pattern PATRON_CODIGO = Pattern.compile("^(?:DER-)?([A-Z0-9]{6})$");

    private static final int ACTIVO = 1;

    private static final List<Integer> VISIBLES = List.of(
            EstadoDerivacion.PENDIENTE, EstadoDerivacion.PROGRAMADA, EstadoDerivacion.CANCELADA);

    private final IDerivacionRepositorio derivacionRepositorio;
    private final IMedicoRepositorio medicoRepositorio;
    private final ICitaMedicaServicio citaMedicaServicio;

    @Transactional(readOnly = true)
    @Override
    public DerivacionGestionRespuestaDTO buscarPorCodigo(String codigo) {

        String normalizado = normalizarCodigo(codigo);

        return derivacionRepositorio.buscarGestionPorCodigo(normalizado, VISIBLES)
                .map(this::aDto)
                .orElseThrow(() -> new EntityNotFoundException(
                        "No existe una derivación con el código " + normalizado + "."));

    }

    @Transactional
    @Override
    public CitaMedicaRespuestaDTO programarCita(Integer idDerivacion, CitaMedicaCrearDTO dto) {

        Derivacion derivacion = derivacionRepositorio.bloquearPorId(idDerivacion)
                .orElseThrow(() -> new EntityNotFoundException("La derivación no existe."));

        validarPendiente(derivacion);

        Integer idPaciente = derivacion.getDiagnostico().getCitaMedica().getPaciente().getId();

        if (!Objects.equals(idPaciente, dto.idPaciente())) {
            throw new IllegalArgumentException("El paciente de la cita debe ser el de la derivación.");
        }

        Medico medico = medicoRepositorio.findById(dto.idMedico())
                .orElseThrow(() -> new EntityNotFoundException("El médico seleccionado no existe."));

        if (!Objects.equals(medico.getEstado(), ACTIVO)
                || !Objects.equals(medico.getEspecialidad().getId(), derivacion.getEspecialidad().getId())) {
            throw new IllegalArgumentException(
                    "El médico debe estar activo y pertenecer a la especialidad derivada.");
        }

        // Reutiliza el servicio de citas: horario del médico, cruces, paciente distinto del médico e historial.
        CitaMedicaRespuestaDTO cita = citaMedicaServicio.crear(dto);

        derivacion.setIdCitaMedica(cita.id());
        derivacion.setEstado(EstadoDerivacion.PROGRAMADA);
        derivacionRepositorio.save(derivacion);

        return cita;

    }

    private void validarPendiente(Derivacion derivacion) {
        switch (derivacion.getEstado()) {
            case EstadoDerivacion.PENDIENTE -> { }
            case EstadoDerivacion.PROGRAMADA -> throw new DataIntegrityViolationException(
                    "La derivación ya tiene una cita programada y no puede reutilizarse.");
            case EstadoDerivacion.CANCELADA -> throw new DataIntegrityViolationException(
                    "La derivación fue cancelada y no puede reutilizarse.");
            default -> throw new EntityNotFoundException("La derivación fue eliminada.");
        }
    }

    private static String normalizarCodigo(String codigo) {
        Matcher matcher = PATRON_CODIGO.matcher(codigo == null ? "" : codigo.trim().toUpperCase());

        if (!matcher.matches()) {
            throw new IllegalArgumentException("El código de derivación no es válido.");
        }

        return PREFIJO_CODIGO + matcher.group(1);
    }

    private static String nombreCompleto(Persona persona) {
        return (persona.getNombre() + " " + persona.getApellidos()).trim();
    }

    private DerivacionGestionRespuestaDTO aDto(Derivacion d) {
        CitaMedica cita = d.getDiagnostico().getCitaMedica();
        Persona paciente = cita.getPaciente().getPersona();
        Persona medico = cita.getMedico().getEmpleado().getPersona();

        return new DerivacionGestionRespuestaDTO(
                d.getId(),
                d.getCodigo(),
                d.getDiagnostico().getId(),
                d.getDiagnostico().getCodigo(),
                cita.getPaciente().getId(),
                nombreCompleto(paciente),
                paciente.getNumeroDocumento(),
                d.getEspecialidad().getId(),
                d.getEspecialidad().getNombre(),
                nombreCompleto(medico),
                d.getFechaDerivacion(),
                d.getUrgencia(),
                d.getEstado(),
                d.getMotivo(),
                d.getIdCitaMedica());
    }

}