package com.salud.consultorio.impl;

import com.salud.consultorio.dto.historiaClinica.AlergiaActualizarDTO;
import com.salud.consultorio.dto.historiaClinica.AlergiaCrearDTO;
import com.salud.consultorio.dto.historiaClinica.AlergiaRespuestaDTO;
import com.salud.consultorio.model.entity.Alergia;
import com.salud.consultorio.model.entity.HistoriaClinica;
import com.salud.consultorio.model.enums.EntidadAuditoriaHC;
import com.salud.consultorio.model.enums.OperacionAuditoriaHC;
import com.salud.consultorio.model.mapper.IHistoriaClinicaMapper;
import com.salud.consultorio.repository.IAlergiaRepositorio;
import com.salud.consultorio.service.IAlergiaServicio;
import com.salud.consultorio.service.IAuditoriaHistoriaClinicaServicio;
import com.salud.consultorio.service.IHistoriaClinicaAccesoServicio;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AlergiaServicioImpl implements IAlergiaServicio {

    private static final int ACTIVO = 1;
    private static final int ELIMINADO = 0;

    private final IAlergiaRepositorio repositorio;
    private final IHistoriaClinicaAccesoServicio accesoServicio;
    private final IAuditoriaHistoriaClinicaServicio auditoriaServicio;
    private final IHistoriaClinicaMapper mapper;

    @Transactional
    @Override
    public AlergiaRespuestaDTO crear(Integer idHistoria, AlergiaCrearDTO dto) {

        HistoriaClinica historia = accesoServicio.historiaParaEscritura(idHistoria);

        Alergia guardada = repositorio.save(Alergia.builder()
                .historiaClinica(historia)
                .sustancia(dto.sustancia().trim())
                .tipoAlergia(dto.tipoAlergia())
                .reaccion(HistoriaClinicaUtil.limpiar(dto.reaccion()))
                .observacion(HistoriaClinicaUtil.limpiar(dto.observacion()))
                .build());

        auditoriaServicio.registrar(historia, EntidadAuditoriaHC.ALERGIA, guardada.getId(),
                OperacionAuditoriaHC.CREACION, null, snapshot(guardada));

        return mapper.toDto(guardada);

    }

    @Transactional
    @Override
    public AlergiaRespuestaDTO actualizar(Integer idHistoria, Integer id, AlergiaActualizarDTO dto) {

        HistoriaClinica historia = accesoServicio.historiaParaEscritura(idHistoria);
        Alergia actual = obtenerActiva(idHistoria, id);

        Map<String, Object> anteriores = new LinkedHashMap<>();
        Map<String, Object> nuevos = new LinkedHashMap<>();

        HistoriaClinicaUtil.comparar("sustancia", actual.getSustancia(), dto.sustancia().trim(), anteriores, nuevos);
        HistoriaClinicaUtil.comparar("tipoAlergia", actual.getTipoAlergia(), dto.tipoAlergia(), anteriores, nuevos);
        HistoriaClinicaUtil.comparar("reaccion", actual.getReaccion(),
                HistoriaClinicaUtil.limpiar(dto.reaccion()), anteriores, nuevos);
        HistoriaClinicaUtil.comparar("observacion", actual.getObservacion(),
                HistoriaClinicaUtil.limpiar(dto.observacion()), anteriores, nuevos);

        if (nuevos.isEmpty()) {
            return mapper.toDto(actual);
        }

        actual.setSustancia(dto.sustancia().trim());
        actual.setTipoAlergia(dto.tipoAlergia());
        actual.setReaccion(HistoriaClinicaUtil.limpiar(dto.reaccion()));
        actual.setObservacion(HistoriaClinicaUtil.limpiar(dto.observacion()));

        auditoriaServicio.registrar(historia, EntidadAuditoriaHC.ALERGIA, actual.getId(),
                OperacionAuditoriaHC.MODIFICACION, anteriores, nuevos);

        return mapper.toDto(actual);

    }

    @Transactional
    @Override
    public void eliminar(Integer idHistoria, Integer id) {

        HistoriaClinica historia = accesoServicio.historiaParaEscritura(idHistoria);
        Alergia actual = obtenerActiva(idHistoria, id);

        Map<String, Object> anteriores = snapshot(actual);

        Map<String, Object> nuevos = new LinkedHashMap<>();
        nuevos.put("estado", ELIMINADO);

        actual.setEstado(ELIMINADO);

        auditoriaServicio.registrar(historia, EntidadAuditoriaHC.ALERGIA, actual.getId(),
                OperacionAuditoriaHC.ELIMINACION, anteriores, nuevos);

    }

    private Alergia obtenerActiva(Integer idHistoria, Integer id) {

        Alergia actual = repositorio.findByIdAndHistoriaClinica_Id(id, idHistoria).orElseThrow(
                () -> new EntityNotFoundException("No existe la alergia")
        );

        if (actual.getEstado() != ACTIVO) {
            throw new EntityNotFoundException("No existe la alergia");
        }

        return actual;

    }

    private Map<String, Object> snapshot(Alergia a) {

        Map<String, Object> datos = new LinkedHashMap<>();
        datos.put("sustancia", a.getSustancia());
        datos.put("tipoAlergia", a.getTipoAlergia());
        datos.put("reaccion", a.getReaccion());
        datos.put("observacion", a.getObservacion());
        return datos;

    }

}