package com.salud.consultorio.impl;

import com.salud.consultorio.dto.historiaClinica.AntecedenteFamiliarActualizarDTO;
import com.salud.consultorio.dto.historiaClinica.AntecedenteFamiliarCrearDTO;
import com.salud.consultorio.dto.historiaClinica.AntecedenteFamiliarRespuestaDTO;
import com.salud.consultorio.model.entity.AntecedenteFamiliar;
import com.salud.consultorio.model.entity.HistoriaClinica;
import com.salud.consultorio.model.enums.EntidadAuditoriaHC;
import com.salud.consultorio.model.enums.OperacionAuditoriaHC;
import com.salud.consultorio.model.mapper.IHistoriaClinicaMapper;
import com.salud.consultorio.repository.IAntecedenteFamiliarRepositorio;
import com.salud.consultorio.service.IAntecedenteFamiliarServicio;
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
public class AntecedenteFamiliarServicioImpl implements IAntecedenteFamiliarServicio {

    private static final int ACTIVO = 1;
    private static final int ELIMINADO = 0;

    private final IAntecedenteFamiliarRepositorio repositorio;
    private final IHistoriaClinicaAccesoServicio accesoServicio;
    private final IAuditoriaHistoriaClinicaServicio auditoriaServicio;
    private final IHistoriaClinicaMapper mapper;

    @Transactional
    @Override
    public AntecedenteFamiliarRespuestaDTO crear(Integer idHistoria, AntecedenteFamiliarCrearDTO dto) {

        HistoriaClinica historia = accesoServicio.historiaParaEscritura(idHistoria);

        AntecedenteFamiliar guardado = repositorio.save(AntecedenteFamiliar.builder()
                .historiaClinica(historia)
                .tipo(dto.tipo())
                .parentesco(dto.parentesco())
                .descripcion(dto.descripcion().trim())
                .observacion(HistoriaClinicaUtil.limpiar(dto.observacion()))
                .build());

        auditoriaServicio.registrar(historia, EntidadAuditoriaHC.ANTECEDENTE_FAMILIAR, guardado.getId(),
                OperacionAuditoriaHC.CREACION, null, snapshot(guardado));

        return mapper.toDto(guardado);

    }

    @Transactional
    @Override
    public AntecedenteFamiliarRespuestaDTO actualizar(Integer idHistoria, Integer id,
                                                      AntecedenteFamiliarActualizarDTO dto) {

        HistoriaClinica historia = accesoServicio.historiaParaEscritura(idHistoria);
        AntecedenteFamiliar actual = obtenerActivo(idHistoria, id);

        Map<String, Object> anteriores = new LinkedHashMap<>();
        Map<String, Object> nuevos = new LinkedHashMap<>();

        HistoriaClinicaUtil.comparar("tipo", actual.getTipo(), dto.tipo(), anteriores, nuevos);
        HistoriaClinicaUtil.comparar("parentesco", actual.getParentesco(), dto.parentesco(), anteriores, nuevos);
        HistoriaClinicaUtil.comparar("descripcion", actual.getDescripcion(), dto.descripcion().trim(), anteriores, nuevos);
        HistoriaClinicaUtil.comparar("observacion", actual.getObservacion(),
                HistoriaClinicaUtil.limpiar(dto.observacion()), anteriores, nuevos);

        if (nuevos.isEmpty()) {
            return mapper.toDto(actual);
        }

        actual.setTipo(dto.tipo());
        actual.setParentesco(dto.parentesco());
        actual.setDescripcion(dto.descripcion().trim());
        actual.setObservacion(HistoriaClinicaUtil.limpiar(dto.observacion()));

        auditoriaServicio.registrar(historia, EntidadAuditoriaHC.ANTECEDENTE_FAMILIAR, actual.getId(),
                OperacionAuditoriaHC.MODIFICACION, anteriores, nuevos);

        return mapper.toDto(actual);

    }

    @Transactional
    @Override
    public void eliminar(Integer idHistoria, Integer id) {

        HistoriaClinica historia = accesoServicio.historiaParaEscritura(idHistoria);
        AntecedenteFamiliar actual = obtenerActivo(idHistoria, id);

        Map<String, Object> anteriores = snapshot(actual);

        Map<String, Object> nuevos = new LinkedHashMap<>();
        nuevos.put("estado", ELIMINADO);

        actual.setEstado(ELIMINADO);

        auditoriaServicio.registrar(historia, EntidadAuditoriaHC.ANTECEDENTE_FAMILIAR, actual.getId(),
                OperacionAuditoriaHC.ELIMINACION, anteriores, nuevos);

    }

    private AntecedenteFamiliar obtenerActivo(Integer idHistoria, Integer id) {

        AntecedenteFamiliar actual = repositorio.findByIdAndHistoriaClinica_Id(id, idHistoria).orElseThrow(
                () -> new EntityNotFoundException("No existe el antecedente familiar")
        );

        if (actual.getEstado() != ACTIVO) {
            throw new EntityNotFoundException("No existe el antecedente familiar");
        }

        return actual;

    }

    private Map<String, Object> snapshot(AntecedenteFamiliar a) {

        Map<String, Object> datos = new LinkedHashMap<>();
        datos.put("tipo", a.getTipo());
        datos.put("parentesco", a.getParentesco());
        datos.put("descripcion", a.getDescripcion());
        datos.put("observacion", a.getObservacion());
        return datos;

    }

}