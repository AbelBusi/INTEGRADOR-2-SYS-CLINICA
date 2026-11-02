package com.salud.consultorio.impl;

import com.salud.consultorio.dto.tratamiento.TratamientoActualizarDTO;
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
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class TratamientoServicioImpl implements ITratamientoServicio {

    private static final int ENTIDAD_ACTIVA = 1;

    private static final int ENTIDAD_ELIMINADA = 0;
    private static final int CITA_ATENDIDA = 3;

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

    @Transactional
    @Override
    public TratamientoRespuestaDTO actualizar(Integer idDiagnostico, Integer idTratamiento, TratamientoActualizarDTO dto) {

        Diagnostico diagnostico = accesoServicio.diagnosticoParaEscritura(idDiagnostico);
        validarAtencionNoFinalizada(diagnostico);

        Tratamiento tratamiento = buscarActivo(idTratamiento, diagnostico.getId());

        String medicamento = dto.nombreMedicamento().trim();

        if (tratamientoRepositorio.existsByDiagnostico_IdAndNombreMedicamentoIgnoreCaseAndEstadoAndIdNot(
                diagnostico.getId(), medicamento, ENTIDAD_ACTIVA, idTratamiento)) {
            throw new DataIntegrityViolationException(
                    "El diagnóstico ya tiene un tratamiento activo con ese medicamento.");
        }

        tratamiento.setNombreMedicamento(medicamento);
        tratamiento.setDosis(dto.dosis().trim());
        tratamiento.setViaAdministracion(dto.viaAdministracion().trim());
        tratamiento.setFrecuencia(dto.frecuencia().trim());
        tratamiento.setDuracionDias(dto.duracionDias());
        tratamiento.setTotCantidad(dto.totCantidad());
        tratamiento.setDescIndicacion(dto.descIndicacion().trim());

        return tratamientoMapper.toDto(tratamientoRepositorio.save(tratamiento));

    }

    @Transactional
    @Override
    public void eliminar(Integer idDiagnostico, Integer idTratamiento) {

        Diagnostico diagnostico = accesoServicio.diagnosticoParaEscritura(idDiagnostico);
        validarAtencionNoFinalizada(diagnostico);

        Tratamiento tratamiento = buscarActivo(idTratamiento, diagnostico.getId());
        tratamiento.setEstado(ENTIDAD_ELIMINADA); // eliminación lógica
        tratamientoRepositorio.save(tratamiento);

    }

    private Tratamiento buscarActivo(Integer idTratamiento, Integer idDiagnostico) {
        return tratamientoRepositorio
                .findByIdAndDiagnostico_IdAndEstado(idTratamiento, idDiagnostico, ENTIDAD_ACTIVA)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tratamiento no encontrado"));
    }

    private void validarAtencionNoFinalizada(Diagnostico diagnostico) {
        if (Objects.equals(diagnostico.getCitaMedica().getEstado(), CITA_ATENDIDA)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "La atención ya fue finalizada: no se pueden modificar los tratamientos");
        }
    }

}