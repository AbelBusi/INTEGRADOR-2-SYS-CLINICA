package com.salud.consultorio.impl;

import com.salud.consultorio.dto.derivacion.DerivacionActualizarDTO;
import com.salud.consultorio.dto.derivacion.DerivacionCrearDTO;
import com.salud.consultorio.dto.derivacion.DerivacionRespuestaDTO;
import com.salud.consultorio.model.entity.Derivacion;
import com.salud.consultorio.model.entity.Diagnostico;
import com.salud.consultorio.model.entity.Especialidad;
import com.salud.consultorio.model.mapper.IDerivacionMapper;
import com.salud.consultorio.repository.IDerivacionRepositorio;
import com.salud.consultorio.repository.IEspecialidadRepositorio;
import com.salud.consultorio.service.IAtencionClinicaAccesoServicio;
import com.salud.consultorio.service.IDerivacionServicio;
import com.salud.consultorio.util.EstadoDerivacion;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class DerivacionServicioImpl implements IDerivacionServicio {

    private static final int ENTIDAD_ACTIVA = 1;

    private static final int URGENCIA_MIN = 1;
    private static final int URGENCIA_MAX = 3;
    private static final int CITA_ATENDIDA = 3;

    private final IDerivacionRepositorio derivacionRepositorio;
    private final IEspecialidadRepositorio especialidadRepositorio;
    private final IAtencionClinicaAccesoServicio accesoServicio;
    private final IDerivacionMapper derivacionMapper;

    private static final List<Integer> ESTADOS_VIGENTES =
            List.of(EstadoDerivacion.PENDIENTE, EstadoDerivacion.PROGRAMADA);

    private static final String PREFIJO_CODIGO = "DER-";
    private static final String ALFABETO_CODIGO = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private static final int LONGITUD_CODIGO = 6;
    private static final int INTENTOS_CODIGO = 10;
    private final SecureRandom aleatorio = new SecureRandom();

    @Transactional
    @Override
    public DerivacionRespuestaDTO actualizar(Integer idDiagnostico, Integer idDerivacion,
                                             DerivacionActualizarDTO dto) {

        Integer urgencia = dto.urgencia();

        if (urgencia != null && (urgencia < URGENCIA_MIN || urgencia > URGENCIA_MAX)) {
            throw new IllegalArgumentException("El nivel de urgencia no es válido.");
        }

        Diagnostico diagnostico = accesoServicio.diagnosticoParaEscritura(idDiagnostico);
        validarAtencionNoFinalizada(diagnostico);

        Derivacion derivacion = buscarModificable(idDerivacion, diagnostico.getId());

        Especialidad especialidad = especialidadRepositorio.findByIdAndEstado(dto.idEspecialidad(), ENTIDAD_ACTIVA)
                .orElseThrow(() -> new EntityNotFoundException(
                        "La especialidad seleccionada no existe o no está activa."));

        if (derivacionRepositorio.existsByDiagnostico_IdAndEspecialidad_IdAndEstadoInAndIdNot(
                diagnostico.getId(), especialidad.getId(), EstadoDerivacion.VIGENTES, idDerivacion)) {
            throw new DataIntegrityViolationException(
                    "El diagnóstico ya tiene una derivación vigente a esa especialidad.");
        }

        derivacion.setEspecialidad(especialidad);
        derivacion.setMotivo(dto.motivo().trim());

        if (urgencia != null) {
            derivacion.setUrgencia(urgencia);
        }

        return derivacionMapper.toDto(derivacionRepositorio.save(derivacion));

    }

    @Transactional
    @Override
    public void eliminar(Integer idDiagnostico, Integer idDerivacion) {

        Diagnostico diagnostico = accesoServicio.diagnosticoParaEscritura(idDiagnostico);
        validarAtencionNoFinalizada(diagnostico);

        Derivacion derivacion = buscarModificable(idDerivacion, diagnostico.getId());
        derivacion.setEstado(EstadoDerivacion.ELIMINADA); // eliminación lógica
        derivacionRepositorio.save(derivacion);

    }

    private Derivacion buscarModificable(Integer idDerivacion, Integer idDiagnostico) {

        Derivacion derivacion = derivacionRepositorio.bloquearPorId(idDerivacion)
                .orElseThrow(() -> new EntityNotFoundException("La derivación no existe."));

        if (!Objects.equals(derivacion.getDiagnostico().getId(), idDiagnostico)) {
            throw new EntityNotFoundException("La derivación no existe.");
        }

        switch (derivacion.getEstado()) {
            case EstadoDerivacion.PENDIENTE -> { }
            case EstadoDerivacion.PROGRAMADA -> throw new DataIntegrityViolationException(
                    "La derivación ya tiene una cita programada y no puede modificarse.");
            case EstadoDerivacion.CANCELADA -> throw new DataIntegrityViolationException(
                    "La derivación fue cancelada y no puede modificarse.");
            default -> throw new EntityNotFoundException("La derivación no existe.");
        }

        return derivacion;

    }

    private void validarAtencionNoFinalizada(Diagnostico diagnostico) {
        if (Objects.equals(diagnostico.getCitaMedica().getEstado(), CITA_ATENDIDA)) {
            throw new IllegalArgumentException(
                    "La atención ya fue finalizada: no se pueden modificar las derivaciones.");
        }
    }

    private String generarCodigoUnico() {
        for (int i = 0; i < INTENTOS_CODIGO; i++) {
            StringBuilder codigo = new StringBuilder(PREFIJO_CODIGO);

            for (int j = 0; j < LONGITUD_CODIGO; j++) {
                codigo.append(ALFABETO_CODIGO.charAt(aleatorio.nextInt(ALFABETO_CODIGO.length())));
            }

            if (!derivacionRepositorio.existsByCodigo(codigo.toString())) {
                return codigo.toString();
            }
        }

        throw new IllegalStateException("No se pudo generar un código de derivación único.");
    }

    @Transactional
    @Override
    public DerivacionRespuestaDTO crear(Integer idDiagnostico, DerivacionCrearDTO dto) {

        Integer urgencia = dto.urgencia();

        if (urgencia != null && (urgencia < URGENCIA_MIN || urgencia > URGENCIA_MAX)) {
            throw new IllegalArgumentException("El nivel de urgencia no es válido.");
        }

        Diagnostico diagnostico = accesoServicio.diagnosticoParaEscritura(idDiagnostico);

        Especialidad especialidad = especialidadRepositorio.findByIdAndEstado(dto.idEspecialidad(), ENTIDAD_ACTIVA)
                .orElseThrow(() -> new EntityNotFoundException(
                        "La especialidad seleccionada no existe o no está activa."));

        if (derivacionRepositorio.existsByDiagnostico_IdAndEspecialidad_IdAndEstadoIn(
                diagnostico.getId(), especialidad.getId(), ESTADOS_VIGENTES)) {
            throw new DataIntegrityViolationException(
                    "El diagnóstico ya tiene una derivación activa a esa especialidad.");
        }

        Derivacion derivacion = Derivacion.builder()
                .diagnostico(diagnostico)
                .especialidad(especialidad)
                .codigo(generarCodigoUnico())
                .motivo(dto.motivo().trim())
                .urgencia(urgencia != null ? urgencia : URGENCIA_MIN)
                .build();

        return derivacionMapper.toDto(derivacionRepositorio.save(derivacion));

    }

    @Transactional(readOnly = true)
    @Override
    public List<DerivacionRespuestaDTO> listaPorDiagnostico(Integer idDiagnostico) {

        Diagnostico diagnostico = accesoServicio.diagnosticoParaLectura(idDiagnostico);

        return derivacionMapper.toDtoList(
                derivacionRepositorio.findByDiagnostico_IdAndEstadoInOrderByIdAsc(diagnostico.getId(), ESTADOS_VIGENTES));

    }

}