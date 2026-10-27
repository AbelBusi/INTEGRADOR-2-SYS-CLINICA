package com.salud.consultorio.impl;

import com.salud.consultorio.dto.tratamiento.TratamientoCrearDTO;
import com.salud.consultorio.dto.tratamiento.TratamientoRespuestaDTO;
import com.salud.consultorio.model.entity.Diagnostico;
import com.salud.consultorio.model.entity.Tratamiento;
import com.salud.consultorio.model.mapper.ITratamientoMapper;
import com.salud.consultorio.repository.ITratamientoRepositorio;
import com.salud.consultorio.service.IAtencionClinicaAccesoServicio;
import com.salud.consultorio.service.ITratamientoServicio;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TratamientoServicioImpl implements ITratamientoServicio {

    private static final int ENTIDAD_ACTIVA = 1;

    private final ITratamientoRepositorio tratamientoRepositorio;
    private final IAtencionClinicaAccesoServicio accesoServicio;
    private final ITratamientoMapper tratamientoMapper;

    @Transactional
    @Override
    public TratamientoRespuestaDTO crear(Integer idDiagnostico, TratamientoCrearDTO dto) {

        Diagnostico diagnostico = accesoServicio.diagnosticoParaEscritura(idDiagnostico);

        String medicamento = dto.nombreMedicamento().trim();

        if (tratamientoRepositorio.existsByDiagnostico_IdAndNombreMedicamentoIgnoreCaseAndEstado(
                diagnostico.getId(), medicamento, ENTIDAD_ACTIVA)) {
            throw new DataIntegrityViolationException(
                    "El diagnóstico ya tiene un tratamiento activo con ese medicamento.");
        }

        Tratamiento tratamiento = Tratamiento.builder()
                .diagnostico(diagnostico)
                .nombreMedicamento(medicamento)
                .dosis(dto.dosis().trim())
                .viaAdministracion(dto.viaAdministracion().trim())
                .frecuencia(dto.frecuencia().trim())
                .duracionDias(dto.duracionDias())
                .totCantidad(dto.totCantidad())
                .descIndicacion(dto.descIndicacion().trim())
                .build();

        return tratamientoMapper.toDto(tratamientoRepositorio.save(tratamiento));

    }

    @Transactional(readOnly = true)
    @Override
    public List<TratamientoRespuestaDTO> listaPorDiagnostico(Integer idDiagnostico) {

        Diagnostico diagnostico = accesoServicio.diagnosticoParaLectura(idDiagnostico);

        return tratamientoMapper.toDtoList(
                tratamientoRepositorio.findByDiagnostico_IdAndEstadoOrderByIdAsc(diagnostico.getId(), ENTIDAD_ACTIVA));

    }

}