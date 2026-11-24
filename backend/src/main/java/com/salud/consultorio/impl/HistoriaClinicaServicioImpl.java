package com.salud.consultorio.impl;

import com.salud.consultorio.dto.historiaClinica.*;
import com.salud.consultorio.model.entity.HistoriaClinica;
import com.salud.consultorio.model.entity.Paciente;
import com.salud.consultorio.model.entity.Persona;
import com.salud.consultorio.model.enums.EntidadAuditoriaHC;
import com.salud.consultorio.model.enums.OperacionAuditoriaHC;
import com.salud.consultorio.model.mapper.IHistoriaClinicaMapper;
import com.salud.consultorio.repository.*;
import com.salud.consultorio.service.IAuditoriaHistoriaClinicaServicio;
import com.salud.consultorio.service.IHistoriaClinicaAccesoServicio;
import com.salud.consultorio.service.IHistoriaClinicaServicio;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class HistoriaClinicaServicioImpl implements IHistoriaClinicaServicio {

    private static final int ACTIVO = 1;

    private final IHistoriaClinicaRepositorio historiaClinicaRepositorio;
    private final IPacienteRepositorio pacienteRepositorio;
    private final IAntecedentePersonalRepositorio antecedentePersonalRepositorio;
    private final IAntecedenteFamiliarRepositorio antecedenteFamiliarRepositorio;
    private final IAlergiaRepositorio alergiaRepositorio;
    private final IHistoriaClinicaAccesoServicio accesoServicio;
    private final IAuditoriaHistoriaClinicaServicio auditoriaServicio;
    private final IHistoriaClinicaMapper mapper;

    @Transactional(readOnly = true)
    @Override
    public HistoriaClinicaRespuestaDTO obtenerPorPaciente(Integer idPaciente) {

        accesoServicio.medicoAutorizadoPara(idPaciente);

        return toDto(buscarPorPaciente(idPaciente));

    }

    @Transactional(readOnly = true)
    @Override
    public HistoriaClinicaRespuestaDTO obtenerMiHistoria() {

        Paciente paciente = accesoServicio.pacienteTitular();

        return toDto(buscarPorPaciente(paciente.getId()));

    }

    @Transactional
    @Override
    public HistoriaClinicaRespuestaDTO crear(HistoriaClinicaCrearDTO dto) {

        accesoServicio.medicoAutorizadoPara(dto.idPaciente());

        Paciente paciente = pacienteRepositorio.findById(dto.idPaciente()).orElseThrow(
                () -> new EntityNotFoundException("No existe el paciente")
        );

        if (paciente.getEstado() != ACTIVO) {
            throw new IllegalArgumentException("El paciente no se encuentra activo.");
        }

        if (historiaClinicaRepositorio.existsByPaciente_Id(paciente.getId())) {
            throw new DataIntegrityViolationException("El paciente ya tiene una historia clínica registrada.");
        }

        HistoriaClinica historia = HistoriaClinica.builder()
                .paciente(paciente)
                .numeroHistoria(String.format("HC-%06d", paciente.getId()))
                .grupoSanguineo(dto.grupoSanguineo())
                .factorRh(dto.factorRh())
                .observaciones(HistoriaClinicaUtil.limpiar(dto.observaciones()))
                .build();

        HistoriaClinica guardada = historiaClinicaRepositorio.save(historia);

        Map<String, Object> nuevos = new LinkedHashMap<>();
        nuevos.put("numeroHistoria", guardada.getNumeroHistoria());
        nuevos.put("grupoSanguineo", guardada.getGrupoSanguineo());
        nuevos.put("factorRh", guardada.getFactorRh());
        nuevos.put("observaciones", guardada.getObservaciones());

        auditoriaServicio.registrar(guardada, EntidadAuditoriaHC.HISTORIA_CLINICA, guardada.getId(),
                OperacionAuditoriaHC.CREACION, null, nuevos);

        return toDto(guardada);

    }

    @Transactional
    @Override
    public HistoriaClinicaRespuestaDTO actualizar(Integer idHistoria, HistoriaClinicaActualizarDTO dto) {

        HistoriaClinica historia = accesoServicio.historiaParaEscritura(idHistoria);

        // Control de concurrencia: si otro médico guardó después de que este usuario cargó la historia,
        // la versión que envía ya no coincide y se rechaza en vez de sobrescribir su cambio.
        if (!Objects.equals(dto.version(), historia.getVersion())) {
            throw new ObjectOptimisticLockingFailureException(HistoriaClinica.class, historia.getId());
        }

        Map<String, Object> anteriores = new LinkedHashMap<>();
        Map<String, Object> nuevos = new LinkedHashMap<>();

        // Campo nulo = sin cambio
        if (dto.grupoSanguineo() != null
                && HistoriaClinicaUtil.comparar("grupoSanguineo", historia.getGrupoSanguineo(),
                dto.grupoSanguineo(), anteriores, nuevos)) {
            historia.setGrupoSanguineo(dto.grupoSanguineo());
        }

        if (dto.factorRh() != null
                && HistoriaClinicaUtil.comparar("factorRh", historia.getFactorRh(),
                dto.factorRh(), anteriores, nuevos)) {
            historia.setFactorRh(dto.factorRh());
        }

        if (dto.observaciones() != null) {
            String observaciones = HistoriaClinicaUtil.limpiar(dto.observaciones());
            if (HistoriaClinicaUtil.comparar("observaciones", historia.getObservaciones(),
                    observaciones, anteriores, nuevos)) {
                historia.setObservaciones(observaciones);
            }
        }

        if (nuevos.isEmpty()) {
            return toDto(historia);
        }

        // saveAndFlush no existe en este repositorio (extiende Repository): el flush ocurre al confirmar
        // la transacción y ahí Hibernate vuelve a validar @Version contra la base de datos.
        historiaClinicaRepositorio.save(historia);

        auditoriaServicio.registrar(historia, EntidadAuditoriaHC.HISTORIA_CLINICA, historia.getId(),
                OperacionAuditoriaHC.MODIFICACION, anteriores, nuevos);

        return toDto(historia);

    }

    @Transactional(readOnly = true)
    @Override
    public List<HistoriaClinicaResumenDTO> listar() {

        // Antes no validaba nada: cualquier usuario autenticado podía listar nombres, DNI y grupo sanguíneo.
        accesoServicio.medicoAutenticado();

        return historiaClinicaRepositorio.listarHistoriasClinicas();
    }

    private HistoriaClinica buscarPorPaciente(Integer idPaciente) {

        return historiaClinicaRepositorio.findByPaciente_Id(idPaciente).orElseThrow(
                () -> new EntityNotFoundException("El paciente aún no tiene historia clínica")
        );

    }

    private HistoriaClinicaRespuestaDTO toDto(HistoriaClinica h) {

        Persona p = h.getPaciente().getPersona();

        return new HistoriaClinicaRespuestaDTO(
                h.getId(),
                h.getNumeroHistoria(),
                new PacienteHistoriaDTO(
                        h.getPaciente().getId(),
                        p.getNombre() + " " + p.getApellidos(),
                        p.getNumeroDocumento(),
                        p.getFechaNacimiento(),
                        p.getGenero()
                ),
                h.getGrupoSanguineo(),
                h.getFactorRh(),
                h.getObservaciones(),
                h.getFechaCreacion(),
                h.getFechaActualizacion(),
                antecedentePersonalRepositorio.listaActivas(h.getId()).stream().map(mapper::toDto).toList(),
                antecedenteFamiliarRepositorio.listaActivas(h.getId()).stream().map(mapper::toDto).toList(),
                alergiaRepositorio.listaActivas(h.getId()).stream().map(mapper::toDto).toList(),
                h.getVersion()
        );

    }

}