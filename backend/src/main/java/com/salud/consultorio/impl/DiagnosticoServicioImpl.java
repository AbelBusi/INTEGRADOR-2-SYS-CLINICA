package com.salud.consultorio.impl;

import com.salud.consultorio.dto.diagnostico.DiagnosticoActualizarDTO;
import com.salud.consultorio.dto.diagnostico.DiagnosticoCrearDTO;
import com.salud.consultorio.dto.diagnostico.DiagnosticoRespuestaDTO;
import com.salud.consultorio.model.entity.CitaMedica;
import com.salud.consultorio.model.entity.Diagnostico;
import com.salud.consultorio.model.mapper.IDiagnosticoMapper;
import com.salud.consultorio.repository.IDerivacionRepositorio;
import com.salud.consultorio.repository.IDiagnosticoRepositorio;
import com.salud.consultorio.repository.IExamenSolicitadoRepositorio;
import com.salud.consultorio.repository.IIndicacionRepositorio;
import com.salud.consultorio.repository.ITratamientoRepositorio;
import com.salud.consultorio.service.IAtencionClinicaAccesoServicio;
import com.salud.consultorio.service.IDiagnosticoServicio;
import com.salud.consultorio.util.EstadoDerivacion;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Clock;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class DiagnosticoServicioImpl implements IDiagnosticoServicio {

    private static final int ENTIDAD_ACTIVA = 1;
    private static final int ENTIDAD_ELIMINADA = 0;
    private static final int CITA_ATENDIDA = 3;

    private static final int TIPO_DIAGNOSTICO_MIN = 1;
    private static final int TIPO_DIAGNOSTICO_MAX = 3;

    private static final String PREFIJO_CODIGO = "DX-";
    private static final String ALFABETO_CODIGO = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private static final int LONGITUD_CODIGO = 6;
    private static final int INTENTOS_CODIGO = 10;

    private final IDiagnosticoRepositorio diagnosticoRepositorio;
    private final ITratamientoRepositorio tratamientoRepositorio;
    private final IIndicacionRepositorio indicacionRepositorio;
    private final IExamenSolicitadoRepositorio examenSolicitadoRepositorio;
    private final IDerivacionRepositorio derivacionRepositorio;
    private final IAtencionClinicaAccesoServicio accesoServicio;
    private final IDiagnosticoMapper diagnosticoMapper;
    private final Clock clock;

    private final SecureRandom aleatorio = new SecureRandom();

    @Transactional
    @Override
    public DiagnosticoRespuestaDTO crear(Integer idCita, DiagnosticoCrearDTO dto) {

        validarTipoDiagnostico(dto.tipoDiagnostico());

        CitaMedica cita = accesoServicio.citaParaEscritura(idCita);

        Diagnostico diagnostico = Diagnostico.builder()
                .citaMedica(cita)
                .codigo(generarCodigoUnico())
                .descripcion(dto.descripcion().trim())
                .tipoDiagnostico(dto.tipoDiagnostico())
                .observaciones(dto.observaciones().trim())
                .fecDiagnostico(LocalDateTime.now(clock))
                .build();

        return diagnosticoMapper.toDto(diagnosticoRepositorio.save(diagnostico));

    }

    @Transactional(readOnly = true)
    @Override
    public List<DiagnosticoRespuestaDTO> listaPorCita(Integer idCita) {

        CitaMedica cita = accesoServicio.citaParaLectura(idCita);

        return diagnosticoMapper.toDtoList(
                diagnosticoRepositorio.findByCitaMedica_IdAndEstadoOrderByFecDiagnosticoAscIdAsc(
                        cita.getId(), ENTIDAD_ACTIVA));

    }

    @Transactional(readOnly = true)
    @Override
    public DiagnosticoRespuestaDTO entidadPorID(Integer idDiagnostico) {

        return diagnosticoMapper.toDto(accesoServicio.diagnosticoParaLectura(idDiagnostico));

    }

    @Transactional
    @Override
    public DiagnosticoRespuestaDTO actualizar(Integer idDiagnostico, DiagnosticoActualizarDTO dto) {

        validarTipoDiagnostico(dto.tipoDiagnostico());

        Diagnostico diagnostico = obtenerModificable(idDiagnostico);

        diagnostico.setDescripcion(dto.descripcion().trim());
        diagnostico.setTipoDiagnostico(dto.tipoDiagnostico());
        diagnostico.setObservaciones(dto.observaciones().trim());

        return diagnosticoMapper.toDto(diagnosticoRepositorio.save(diagnostico));

    }

    @Transactional
    @Override
    public void eliminar(Integer idDiagnostico) {

        Diagnostico diagnostico = obtenerModificable(idDiagnostico);

        if (derivacionRepositorio.existsByDiagnostico_IdAndEstado(idDiagnostico, EstadoDerivacion.PROGRAMADA)) {
            throw new DataIntegrityViolationException(
                    "No se puede eliminar el diagnóstico: tiene derivaciones con una cita ya programada.");
        }

        // Los registros del diagnóstico se dan de baja junto con él (eliminación lógica).
        tratamientoRepositorio.desactivarPorDiagnostico(idDiagnostico);
        indicacionRepositorio.desactivarPorDiagnostico(idDiagnostico);
        examenSolicitadoRepositorio.desactivarPorDiagnostico(idDiagnostico);
        derivacionRepositorio.cambiarEstadoPorDiagnostico(
                idDiagnostico, EstadoDerivacion.PENDIENTE, EstadoDerivacion.ELIMINADA);

        diagnostico.setEstado(ENTIDAD_ELIMINADA);
        diagnosticoRepositorio.save(diagnostico);

    }

    private Diagnostico obtenerModificable(Integer idDiagnostico) {

        Diagnostico diagnostico = accesoServicio.diagnosticoParaEscritura(idDiagnostico);

        if (!Objects.equals(diagnostico.getEstado(), ENTIDAD_ACTIVA)) {
            throw new EntityNotFoundException("No existe el diagnóstico.");
        }

        if (Objects.equals(diagnostico.getCitaMedica().getEstado(), CITA_ATENDIDA)) {
            throw new IllegalArgumentException(
                    "La atención ya fue finalizada: no se pueden modificar los diagnósticos.");
        }

        return diagnostico;

    }

    private String generarCodigoUnico() {

        for (int i = 0; i < INTENTOS_CODIGO; i++) {
            StringBuilder codigo = new StringBuilder(PREFIJO_CODIGO);

            for (int j = 0; j < LONGITUD_CODIGO; j++) {
                codigo.append(ALFABETO_CODIGO.charAt(aleatorio.nextInt(ALFABETO_CODIGO.length())));
            }

            if (!diagnosticoRepositorio.existsByCodigo(codigo.toString())) {
                return codigo.toString();
            }
        }

        throw new IllegalStateException("No se pudo generar un código de diagnóstico único.");

    }

    private void validarTipoDiagnostico(Integer tipo) {

        if (tipo == null || tipo < TIPO_DIAGNOSTICO_MIN || tipo > TIPO_DIAGNOSTICO_MAX) {
            throw new IllegalArgumentException("El tipo de diagnóstico no es válido.");
        }

    }

}