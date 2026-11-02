package com.salud.consultorio.impl;

import com.salud.consultorio.dto.examenSolicitado.ExamenSolicitadoActualizarDTO;
import com.salud.consultorio.dto.examenSolicitado.ExamenSolicitadoCrearDTO;
import com.salud.consultorio.dto.examenSolicitado.ExamenSolicitadoRespuestaDTO;
import com.salud.consultorio.model.entity.Diagnostico;
import com.salud.consultorio.model.entity.ExamenSolicitado;
import com.salud.consultorio.model.mapper.IExamenSolicitadoMapper;
import com.salud.consultorio.repository.IExamenSolicitadoRepositorio;
import com.salud.consultorio.service.IAtencionClinicaAccesoServicio;
import com.salud.consultorio.service.IExamenSolicitadoServicio;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class ExamenSolicitadoServicioImpl implements IExamenSolicitadoServicio {

    private static final int ENTIDAD_ACTIVA = 1;
    private static final int ENTIDAD_ELIMINADA = 0;
    private static final int CITA_ATENDIDA = 3;

    private final IExamenSolicitadoRepositorio examenSolicitadoRepositorio;
    private final IAtencionClinicaAccesoServicio accesoServicio;
    private final IExamenSolicitadoMapper examenSolicitadoMapper;

    @Transactional
    @Override
    public ExamenSolicitadoRespuestaDTO crear(Integer idDiagnostico, ExamenSolicitadoCrearDTO dto) {

        Diagnostico diagnostico = accesoServicio.diagnosticoParaEscritura(idDiagnostico);

        String nombre = dto.nombreExamen().trim();

        if (examenSolicitadoRepositorio.existsByDiagnostico_IdAndNombreExamenIgnoreCaseAndEstado(
                diagnostico.getId(), nombre, ENTIDAD_ACTIVA)) {
            throw new DataIntegrityViolationException(
                    "El diagnóstico ya tiene un examen activo con ese nombre.");
        }

        ExamenSolicitado examen = ExamenSolicitado.builder()
                .diagnostico(diagnostico)
                .nombreExamen(nombre)
                .tipoExamen(dto.tipoExamen().trim())
                .motivo(dto.motivo().trim())
                .indicaciones(opcional(dto.indicaciones()))
                .prioridad(dto.prioridad().trim())
                .requiereAyuno(dto.requiereAyuno())
                .fechaSolicitud(LocalDateTime.now())
                .observacion(opcional(dto.observacion()))
                .build();

        return examenSolicitadoMapper.toDto(examenSolicitadoRepositorio.save(examen));

    }

    @Transactional(readOnly = true)
    @Override
    public List<ExamenSolicitadoRespuestaDTO> listaPorDiagnostico(Integer idDiagnostico) {

        Diagnostico diagnostico = accesoServicio.diagnosticoParaLectura(idDiagnostico);

        return examenSolicitadoMapper.toDtoList(
                examenSolicitadoRepositorio.findByDiagnostico_IdAndEstadoOrderByIdAsc(
                        diagnostico.getId(), ENTIDAD_ACTIVA));

    }

    @Transactional
    @Override
    public ExamenSolicitadoRespuestaDTO actualizar(Integer idDiagnostico, Integer idExamen,
                                                   ExamenSolicitadoActualizarDTO dto) {

        Diagnostico diagnostico = accesoServicio.diagnosticoParaEscritura(idDiagnostico);
        validarAtencionNoFinalizada(diagnostico);

        ExamenSolicitado examen = buscarActivo(idExamen, diagnostico.getId());

        String nombre = dto.nombreExamen().trim();

        if (examenSolicitadoRepositorio.existsByDiagnostico_IdAndNombreExamenIgnoreCaseAndEstadoAndIdNot(
                diagnostico.getId(), nombre, ENTIDAD_ACTIVA, idExamen)) {
            throw new DataIntegrityViolationException(
                    "El diagnóstico ya tiene un examen activo con ese nombre.");
        }

        examen.setNombreExamen(nombre);
        examen.setTipoExamen(dto.tipoExamen().trim());
        examen.setMotivo(dto.motivo().trim());
        examen.setIndicaciones(opcional(dto.indicaciones()));
        examen.setPrioridad(dto.prioridad().trim());
        examen.setRequiereAyuno(dto.requiereAyuno());
        examen.setObservacion(opcional(dto.observacion()));

        return examenSolicitadoMapper.toDto(examenSolicitadoRepositorio.save(examen));

    }

    @Transactional
    @Override
    public void eliminar(Integer idDiagnostico, Integer idExamen) {

        Diagnostico diagnostico = accesoServicio.diagnosticoParaEscritura(idDiagnostico);
        validarAtencionNoFinalizada(diagnostico);

        ExamenSolicitado examen = buscarActivo(idExamen, diagnostico.getId());
        examen.setEstado(ENTIDAD_ELIMINADA); // eliminación lógica
        examenSolicitadoRepositorio.save(examen);

    }

    private ExamenSolicitado buscarActivo(Integer idExamen, Integer idDiagnostico) {
        return examenSolicitadoRepositorio
                .findByIdAndDiagnostico_IdAndEstado(idExamen, idDiagnostico, ENTIDAD_ACTIVA)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Examen solicitado no encontrado"));
    }

    private void validarAtencionNoFinalizada(Diagnostico diagnostico) {
        if (Objects.equals(diagnostico.getCitaMedica().getEstado(), CITA_ATENDIDA)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "La atención ya fue finalizada: no se pueden modificar los exámenes solicitados");
        }
    }

    private String opcional(String valor) {
        return (valor == null || valor.isBlank()) ? null : valor.trim();
    }

}