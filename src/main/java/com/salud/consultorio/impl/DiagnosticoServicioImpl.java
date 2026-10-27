package com.salud.consultorio.impl;

import com.salud.consultorio.dto.diagnostico.DiagnosticoCrearDTO;
import com.salud.consultorio.dto.diagnostico.DiagnosticoRespuestaDTO;
import com.salud.consultorio.model.entity.CitaMedica;
import com.salud.consultorio.model.entity.Diagnostico;
import com.salud.consultorio.model.mapper.IDiagnosticoMapper;
import com.salud.consultorio.repository.IDiagnosticoRepositorio;
import com.salud.consultorio.service.IAtencionClinicaAccesoServicio;
import com.salud.consultorio.service.IDiagnosticoServicio;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DiagnosticoServicioImpl implements IDiagnosticoServicio {

    private static final int ENTIDAD_ACTIVA = 1;

    private static final int TIPO_DIAGNOSTICO_MIN = 1;
    private static final int TIPO_DIAGNOSTICO_MAX = 3;

    private final IDiagnosticoRepositorio diagnosticoRepositorio;
    private final IAtencionClinicaAccesoServicio accesoServicio;
    private final IDiagnosticoMapper diagnosticoMapper;
    private final Clock clock;

    @Transactional
    @Override
    public DiagnosticoRespuestaDTO crear(Integer idCita, DiagnosticoCrearDTO dto) {

        validarTipoDiagnostico(dto.tipoDiagnostico());

        CitaMedica cita = accesoServicio.citaParaEscritura(idCita);

        String codigo = dto.codigo().trim();

        if (diagnosticoRepositorio.existsByCitaMedica_IdAndCodigoIgnoreCaseAndEstado(
                cita.getId(), codigo, ENTIDAD_ACTIVA)) {
            throw new DataIntegrityViolationException("La cita ya tiene un diagnóstico activo con ese código.");
        }

        Diagnostico diagnostico = Diagnostico.builder()
                .citaMedica(cita)
                .codigo(codigo)
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

    private void validarTipoDiagnostico(Integer tipo) {

        if (tipo == null || tipo < TIPO_DIAGNOSTICO_MIN || tipo > TIPO_DIAGNOSTICO_MAX) {
            throw new IllegalArgumentException("El tipo de diagnóstico no es válido.");
        }

    }

}