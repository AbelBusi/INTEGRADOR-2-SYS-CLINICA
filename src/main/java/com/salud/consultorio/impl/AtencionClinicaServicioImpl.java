package com.salud.consultorio.impl;

import com.salud.consultorio.dto.atencionClinica.AtencionClinicaRespuestaDTO;
import com.salud.consultorio.dto.atencionClinica.DiagnosticoDetalleDTO;
import com.salud.consultorio.dto.citaMedica.CitaMedicaRespuestaDTO;
import com.salud.consultorio.dto.derivacion.DerivacionRespuestaDTO;
import com.salud.consultorio.dto.diagnostico.DiagnosticoRespuestaDTO;
import com.salud.consultorio.dto.examenSolicitado.ExamenSolicitadoRespuestaDTO;
import com.salud.consultorio.dto.indicacion.IndicacionRespuestaDTO;
import com.salud.consultorio.dto.tratamiento.TratamientoRespuestaDTO;
import com.salud.consultorio.model.mapper.IDerivacionMapper;
import com.salud.consultorio.model.mapper.IDiagnosticoMapper;
import com.salud.consultorio.model.mapper.IExamenSolicitadoMapper;
import com.salud.consultorio.model.mapper.IIndicacionMapper;
import com.salud.consultorio.model.mapper.ITratamientoMapper;
import com.salud.consultorio.repository.ICitaMedicaRepositorio;
import com.salud.consultorio.repository.IDerivacionRepositorio;
import com.salud.consultorio.repository.IDiagnosticoRepositorio;
import com.salud.consultorio.repository.IExamenSolicitadoRepositorio;
import com.salud.consultorio.repository.IIndicacionRepositorio;
import com.salud.consultorio.repository.ITratamientoRepositorio;
import com.salud.consultorio.service.IAtencionClinicaAccesoServicio;
import com.salud.consultorio.service.IAtencionClinicaServicio;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AtencionClinicaServicioImpl implements IAtencionClinicaServicio {

    private static final int ENTIDAD_ACTIVA = 1;

    private final IAtencionClinicaAccesoServicio accesoServicio;
    private final ICitaMedicaRepositorio citaMedicaRepositorio;
    private final IDiagnosticoRepositorio diagnosticoRepositorio;
    private final ITratamientoRepositorio tratamientoRepositorio;
    private final IIndicacionRepositorio indicacionRepositorio;
    private final IExamenSolicitadoRepositorio examenSolicitadoRepositorio;
    private final IDerivacionRepositorio derivacionRepositorio;
    private final IDiagnosticoMapper diagnosticoMapper;
    private final ITratamientoMapper tratamientoMapper;
    private final IIndicacionMapper indicacionMapper;
    private final IExamenSolicitadoMapper examenSolicitadoMapper;
    private final IDerivacionMapper derivacionMapper;

    @Transactional(readOnly = true)
    @Override
    public AtencionClinicaRespuestaDTO detallePorCita(Integer idCita) {

        accesoServicio.citaParaLectura(idCita);

        CitaMedicaRespuestaDTO cita = citaMedicaRepositorio.buscarDetallePorId(idCita).orElseThrow(
                () -> new EntityNotFoundException("No existe la cita médica")
        );

        List<DiagnosticoRespuestaDTO> diagnosticos = diagnosticoMapper.toDtoList(
                diagnosticoRepositorio.findByCitaMedica_IdAndEstadoOrderByFecDiagnosticoAscIdAsc(
                        idCita, ENTIDAD_ACTIVA));

        Map<Integer, List<TratamientoRespuestaDTO>> tratamientos = agrupar(
                tratamientoMapper.toDtoList(tratamientoRepositorio
                        .findByDiagnostico_CitaMedica_IdAndEstadoOrderByIdAsc(idCita, ENTIDAD_ACTIVA)),
                TratamientoRespuestaDTO::idDiagnostico);

        Map<Integer, List<IndicacionRespuestaDTO>> indicaciones = agrupar(
                indicacionMapper.toDtoList(indicacionRepositorio
                        .findByDiagnostico_CitaMedica_IdAndEstadoOrderByIdAsc(idCita, ENTIDAD_ACTIVA)),
                IndicacionRespuestaDTO::idDiagnostico);

        Map<Integer, List<ExamenSolicitadoRespuestaDTO>> examenes = agrupar(
                examenSolicitadoMapper.toDtoList(examenSolicitadoRepositorio
                        .findByDiagnostico_CitaMedica_IdAndEstadoOrderByIdAsc(idCita, ENTIDAD_ACTIVA)),
                ExamenSolicitadoRespuestaDTO::idDiagnostico);

        Map<Integer, List<DerivacionRespuestaDTO>> derivaciones = agrupar(
                derivacionMapper.toDtoList(derivacionRepositorio
                        .findByDiagnostico_CitaMedica_IdAndEstadoOrderByIdAsc(idCita, ENTIDAD_ACTIVA)),
                DerivacionRespuestaDTO::idDiagnostico);

        List<DiagnosticoDetalleDTO> detalle = diagnosticos.stream()
                .map(d -> new DiagnosticoDetalleDTO(
                        d,
                        tratamientos.getOrDefault(d.id(), List.of()),
                        indicaciones.getOrDefault(d.id(), List.of()),
                        examenes.getOrDefault(d.id(), List.of()),
                        derivaciones.getOrDefault(d.id(), List.of())))
                .toList();

        return new AtencionClinicaRespuestaDTO(cita, detalle);

    }

    private <T> Map<Integer, List<T>> agrupar(List<T> lista, Function<T, Integer> clave) {
        return lista.stream().collect(Collectors.groupingBy(clave));
    }

}