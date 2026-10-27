package com.salud.consultorio.impl;

import com.salud.consultorio.dto.examenSolicitado.ExamenSolicitadoCrearDTO;
import com.salud.consultorio.dto.examenSolicitado.ExamenSolicitadoRespuestaDTO;
import com.salud.consultorio.model.entity.Diagnostico;
import com.salud.consultorio.model.entity.ExamenSolicitado;
import com.salud.consultorio.model.mapper.IExamenSolicitadoMapper;
import com.salud.consultorio.repository.IExamenSolicitadoRepositorio;
import com.salud.consultorio.service.IAtencionClinicaAccesoServicio;
import com.salud.consultorio.service.IExamenSolicitadoServicio;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ExamenSolicitadoServicioImpl implements IExamenSolicitadoServicio {

    private static final int ENTIDAD_ACTIVA = 1;

    private final IExamenSolicitadoRepositorio examenSolicitadoRepositorio;
    private final IAtencionClinicaAccesoServicio accesoServicio;
    private final IExamenSolicitadoMapper examenSolicitadoMapper;

    @Transactional
    @Override
    public ExamenSolicitadoRespuestaDTO crear(Integer idDiagnostico, ExamenSolicitadoCrearDTO dto) {

        Diagnostico diagnostico = accesoServicio.diagnosticoParaEscritura(idDiagnostico);

        ExamenSolicitado examen = ExamenSolicitado.builder()
                .diagnostico(diagnostico)
                .motivo(dto.motivo().trim())
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

}