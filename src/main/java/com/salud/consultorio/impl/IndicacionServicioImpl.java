package com.salud.consultorio.impl;

import com.salud.consultorio.dto.indicacion.IndicacionCrearDTO;
import com.salud.consultorio.dto.indicacion.IndicacionRespuestaDTO;
import com.salud.consultorio.model.entity.Diagnostico;
import com.salud.consultorio.model.entity.Indicacion;
import com.salud.consultorio.model.mapper.IIndicacionMapper;
import com.salud.consultorio.repository.IIndicacionRepositorio;
import com.salud.consultorio.service.IAtencionClinicaAccesoServicio;
import com.salud.consultorio.service.IIndicacionServicio;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class IndicacionServicioImpl implements IIndicacionServicio {

    private static final int ENTIDAD_ACTIVA = 1;

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

}