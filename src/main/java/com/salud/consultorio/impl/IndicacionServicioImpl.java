package com.salud.consultorio.impl;

import com.salud.consultorio.dto.indicacion.IndicacionActualizarDTO;
import com.salud.consultorio.dto.indicacion.IndicacionCrearDTO;
import com.salud.consultorio.dto.indicacion.IndicacionRespuestaDTO;
import com.salud.consultorio.model.entity.Diagnostico;
import com.salud.consultorio.model.entity.Indicacion;
import com.salud.consultorio.model.mapper.IIndicacionMapper;
import com.salud.consultorio.repository.IIndicacionRepositorio;
import com.salud.consultorio.service.IAtencionClinicaAccesoServicio;
import com.salud.consultorio.service.IIndicacionServicio;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class IndicacionServicioImpl implements IIndicacionServicio {

    private static final int ENTIDAD_ACTIVA = 1;

    private static final int ENTIDAD_ELIMINADA = 0;
    private static final int CITA_ATENDIDA = 3;

    private final IIndicacionRepositorio indicacionRepositorio;
    private final IAtencionClinicaAccesoServicio accesoServicio;
    private final IIndicacionMapper indicacionMapper;

    @Transactional
    @Override
    public IndicacionRespuestaDTO crear(Integer idDiagnostico, IndicacionCrearDTO dto) {

        Diagnostico diagnostico = accesoServicio.diagnosticoParaEscritura(idDiagnostico);

        Indicacion indicacion = Indicacion.builder()
                .diagnostico(diagnostico)
                .tipoIndicacion(dto.tipoIndicacion().trim())
                .descripcion(dto.descripcion().trim())
                .diasReposo(dto.diasReposo())
                .frecuencia(dto.frecuencia().trim())
                .build();

        return indicacionMapper.toDto(indicacionRepositorio.save(indicacion));

    }

    @Transactional(readOnly = true)
    @Override
    public List<IndicacionRespuestaDTO> listaPorDiagnostico(Integer idDiagnostico) {

        Diagnostico diagnostico = accesoServicio.diagnosticoParaLectura(idDiagnostico);

        return indicacionMapper.toDtoList(
                indicacionRepositorio.findByDiagnostico_IdAndEstadoOrderByIdAsc(diagnostico.getId(), ENTIDAD_ACTIVA));

    }

    @Transactional
    @Override
    public IndicacionRespuestaDTO actualizar(Integer idDiagnostico, Integer idIndicacion, IndicacionActualizarDTO dto) {

        Diagnostico diagnostico = accesoServicio.diagnosticoParaEscritura(idDiagnostico);
        validarAtencionNoFinalizada(diagnostico);

        Indicacion indicacion = buscarActiva(idIndicacion, diagnostico.getId());
        indicacion.setTipoIndicacion(dto.tipoIndicacion().trim());
        indicacion.setDescripcion(dto.descripcion().trim());
        indicacion.setDiasReposo(dto.diasReposo());
        indicacion.setFrecuencia(dto.frecuencia().trim());

        return indicacionMapper.toDto(indicacionRepositorio.save(indicacion));

    }

    @Transactional
    @Override
    public void eliminar(Integer idDiagnostico, Integer idIndicacion) {

        Diagnostico diagnostico = accesoServicio.diagnosticoParaEscritura(idDiagnostico);
        validarAtencionNoFinalizada(diagnostico);

        Indicacion indicacion = buscarActiva(idIndicacion, diagnostico.getId());
        indicacion.setEstado(ENTIDAD_ELIMINADA);
        indicacionRepositorio.save(indicacion);

    }

    private Indicacion buscarActiva(Integer idIndicacion, Integer idDiagnostico) {
        return indicacionRepositorio
                .findByIdAndDiagnostico_IdAndEstado(idIndicacion, idDiagnostico, ENTIDAD_ACTIVA)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Indicación no encontrada"));
    }

    private void validarAtencionNoFinalizada(Diagnostico diagnostico) {
        if (Objects.equals(diagnostico.getCitaMedica().getEstado(), CITA_ATENDIDA)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "La atención ya fue finalizada: no se pueden modificar las indicaciones");
        }
    }
}