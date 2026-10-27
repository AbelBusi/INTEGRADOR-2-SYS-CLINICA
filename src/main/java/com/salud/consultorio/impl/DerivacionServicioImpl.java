package com.salud.consultorio.impl;

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
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DerivacionServicioImpl implements IDerivacionServicio {

    private static final int ENTIDAD_ACTIVA = 1;

    private static final int URGENCIA_MIN = 1;
    private static final int URGENCIA_MAX = 3;

    private final IDerivacionRepositorio derivacionRepositorio;
    private final IEspecialidadRepositorio especialidadRepositorio;
    private final IAtencionClinicaAccesoServicio accesoServicio;
    private final IDerivacionMapper derivacionMapper;

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

        if (derivacionRepositorio.existsByDiagnostico_IdAndEspecialidad_IdAndEstado(
                diagnostico.getId(), especialidad.getId(), ENTIDAD_ACTIVA)) {
            throw new DataIntegrityViolationException(
                    "El diagnóstico ya tiene una derivación activa a esa especialidad.");
        }

        Derivacion derivacion = Derivacion.builder()
                .diagnostico(diagnostico)
                .especialidad(especialidad)
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
                derivacionRepositorio.findByDiagnostico_IdAndEstadoOrderByIdAsc(diagnostico.getId(), ENTIDAD_ACTIVA));

    }

}