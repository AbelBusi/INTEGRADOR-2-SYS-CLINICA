package com.salud.consultorio.impl;

import com.salud.consultorio.dto.historiaClinica.AntecedentePersonalActualizarDTO;
import com.salud.consultorio.dto.historiaClinica.AntecedentePersonalCrearDTO;
import com.salud.consultorio.dto.historiaClinica.AntecedentePersonalRespuestaDTO;
import com.salud.consultorio.model.entity.AntecedentePersonal;
import com.salud.consultorio.model.entity.HistoriaClinica;
import com.salud.consultorio.model.enums.EntidadAuditoriaHC;
import com.salud.consultorio.model.enums.OperacionAuditoriaHC;
import com.salud.consultorio.model.mapper.IHistoriaClinicaMapper;
import com.salud.consultorio.repository.IAntecedentePersonalRepositorio;
import com.salud.consultorio.service.IAntecedentePersonalServicio;
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
public class AntecedentePersonalServicioImpl implements IAntecedentePersonalServicio {

    private static final int ACTIVO = 1;
    private static final int ELIMINADO = 0;

    private final IAntecedentePersonalRepositorio repositorio;
    private final IHistoriaClinicaAccesoServicio accesoServicio;
    private final IAuditoriaHistoriaClinicaServicio auditoriaServicio;
    private final IHistoriaClinicaMapper mapper;

    @Transactional
    @Override
    public AntecedentePersonalRespuestaDTO crear(Integer idHistoria, AntecedentePersonalCrearDTO dto) {

        HistoriaClinica historia = accesoServicio.historiaParaEscritura(idHistoria);

        AntecedentePersonal guardado = repositorio.save(AntecedentePersonal.builder()
                .historiaClinica(historia)
                .tipo(dto.tipo())
                .descripcion(dto.descripcion().trim())
                .anio(dto.anio())
                .observacion(HistoriaClinicaUtil.limpiar(dto.observacion()))
                .build());

        auditoriaServicio.registrar(historia, EntidadAuditoriaHC.ANTECEDENTE_PERSONAL, guardado.getId(),
                OperacionAuditoriaHC.CREACION, null, snapshot(guardado));

        return mapper.toDto(guardado);

    }

    @Transactional
    @Override
    public AntecedentePersonalRespuestaDTO actualizar(Integer idHistoria, Integer id,
                                                      AntecedentePersonalActualizarDTO dto) {

        HistoriaClinica historia = accesoServicio.historiaParaEscritura(idHistoria);
        AntecedentePersonal actual = obtenerActivo(idHistoria, id);

        Map<String, Object> anteriores = new LinkedHashMap<>();
        Map<String, Object> nuevos = new LinkedHashMap<>();

        HistoriaClinicaUtil.comparar("tipo", actual.getTipo(), dto.tipo(), anteriores, nuevos);
        HistoriaClinicaUtil.comparar("descripcion", actual.getDescripcion(), dto.descripcion().trim(), anteriores, nuevos);
        HistoriaClinicaUtil.comparar("anio", actual.getAnio(), dto.anio(), anteriores, nuevos);
        HistoriaClinicaUtil.comparar("observacion", actual.getObservacion(),
                HistoriaClinicaUtil.limpiar(dto.observacion()), anteriores, nuevos);

        if (nuevos.isEmpty()) {
            return mapper.toDto(actual);
        }

        actual.setTipo(dto.tipo());
        actual.setDescripcion(dto.descripcion().trim());
        actual.setAnio(dto.anio());
        actual.setObservacion(HistoriaClinicaUtil.limpiar(dto.observacion()));

        auditoriaServicio.registrar(historia, EntidadAuditoriaHC.ANTECEDENTE_PERSONAL, actual.getId(),
                OperacionAuditoriaHC.MODIFICACION, anteriores, nuevos);

        return mapper.toDto(actual);

    }

    // Eliminación lógica: el registro se conserva y queda auditado
    @Transactional
    @Override
    public void eliminar(Integer idHistoria, Integer id) {

        HistoriaClinica historia = accesoServicio.historiaParaEscritura(idHistoria);
        AntecedentePersonal actual = obtenerActivo(idHistoria, id);

        Map<String, Object> anteriores = snapshot(actual);

        Map<String, Object> nuevos = new LinkedHashMap<>();
        nuevos.put("estado", ELIMINADO);

        actual.setEstado(ELIMINADO);

        auditoriaServicio.registrar(historia, EntidadAuditoriaHC.ANTECEDENTE_PERSONAL, actual.getId(),
                OperacionAuditoriaHC.ELIMINACION, anteriores, nuevos);

    }

    private AntecedentePersonal obtenerActivo(Integer idHistoria, Integer id) {

        AntecedentePersonal actual = repositorio.findByIdAndHistoriaClinica_Id(id, idHistoria).orElseThrow(
                () -> new EntityNotFoundException("No existe el antecedente personal")
        );

        if (actual.getEstado() != ACTIVO) {
            throw new EntityNotFoundException("No existe el antecedente personal");
        }

        return actual;

    }

    private Map<String, Object> snapshot(AntecedentePersonal a) {

        Map<String, Object> datos = new LinkedHashMap<>();
        datos.put("tipo", a.getTipo());
        datos.put("descripcion", a.getDescripcion());
        datos.put("anio", a.getAnio());
        datos.put("observacion", a.getObservacion());
        return datos;

    }

}