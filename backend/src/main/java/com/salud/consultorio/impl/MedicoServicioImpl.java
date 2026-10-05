package com.salud.consultorio.impl;

import com.salud.consultorio.dto.medico.*;
import com.salud.consultorio.model.entity.Medico;
import com.salud.consultorio.model.entity.Empleado;
import com.salud.consultorio.model.entity.Especialidad;
import com.salud.consultorio.model.enums.EntidadEstado;
import com.salud.consultorio.model.mapper.IMedicoMapper;
import com.salud.consultorio.repository.IMedicoRepositorio;
import com.salud.consultorio.repository.IEmpleadoRepositorio;
import com.salud.consultorio.repository.IEspecialidadRepositorio;
import com.salud.consultorio.service.IMedicoServicio;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MedicoServicioImpl implements IMedicoServicio {

    private static final int ESTADO_ELIMINADO = 0;
    private static final int ESTADO_ACTIVO = 1;
    private static final int ESTADO_INACTIVO = 2;

    private final IMedicoRepositorio medicoRepositorio;
    private final IEmpleadoRepositorio empleadoRepositorio;
    private final IEspecialidadRepositorio especialidadRepositorio;
    private final IMedicoMapper medicoMapper;

    @Transactional(readOnly = true)
    @Override
    public MedicoDetalleDTO entidadPorID(Integer id) {

        validarId(id);

        return medicoRepositorio.buscarDetallePorId(id)
                .orElseThrow(() ->
                        new EntityNotFoundException("No se encontró el medico con ID: " + id)
                );
    }

    @Transactional(readOnly = true)
    @Override
    public List<MedicoLeerDTO> lista(EntidadEstado estado) {

        if (estado == EntidadEstado.ACTIVO) {
            return medicoRepositorio.listaPorEstado(ESTADO_ACTIVO);
        }

        if (estado == EntidadEstado.INACTIVO) {
            return medicoRepositorio.listaPorEstado(ESTADO_INACTIVO);
        }

        return medicoRepositorio.listaPorEstadoActivoInactivo();
    }

    @Transactional
    @Override
    public MedicoRespuestaDTO crear(MedicoCrearDTO dto) {

        if (dto == null || dto.idEmpleado() == null || dto.idEspecialidad() == null) {
            throw new IllegalArgumentException("Los datos del medico son obligatorios.");
        }

        Empleado empleado = empleadoRepositorio.findById(dto.idEmpleado()).orElseThrow(
                () -> new EntityNotFoundException("El empleado seleccionado no existe.")
        );

        if (empleado.getEstado() != ESTADO_ACTIVO) {
            throw new IllegalArgumentException("Solo se puede registrar como medico a un empleado activo.");
        }

        if (medicoRepositorio.existsByEmpleadoId(empleado.getId())) {
            throw new DataIntegrityViolationException("El empleado ya se encuentra registrado como medico.");
        }

        if (medicoRepositorio.existsByNumeroColegiatura(dto.numeroColegiatura())) {
            throw new DataIntegrityViolationException("El número de colegiatura ya pertenece a otro medico.");
        }

        Especialidad especialidad = obtenerEspecialidadActiva(dto.idEspecialidad());

        Medico medico = medicoMapper.toEntity(dto);

        medico.setEmpleado(empleado);
        medico.setEspecialidad(especialidad);

        Medico guardado = medicoRepositorio.save(medico);

        return medicoMapper.toDto(guardado);
    }

    @Transactional
    @Override
    public MedicoRespuestaDTO actualizar(MedicoActualizarDTO dto, Integer id) {

        validarId(id);

        if (dto == null || dto.idEspecialidad() == null) {
            throw new IllegalArgumentException("Los datos del medico son obligatorios.");
        }

        Medico medico = medicoRepositorio.findById(id).orElseThrow(
                () -> new EntityNotFoundException("El medico que desea actualizar no existe.")
        );

        if (medico.getEstado() == ESTADO_ELIMINADO) {
            throw new IllegalArgumentException("No se puede actualizar un medico eliminado.");
        }

        if (medicoRepositorio.existsByNumeroColegiaturaAndIdNot(dto.numeroColegiatura(), id)) {
            throw new DataIntegrityViolationException("El número de colegiatura ya pertenece a otro medico.");
        }

        // Solo se consulta la especialidad si realmente cambió.
        if (!medico.getEspecialidad().getId().equals(dto.idEspecialidad())) {
            medico.setEspecialidad(obtenerEspecialidadActiva(dto.idEspecialidad()));
        }

        medicoMapper.updateFromDto(dto, medico);

        return medicoMapper.toDto(medico);
    }

    @Transactional
    @Override
    public void eliminarPorId(Integer id) {

        validarId(id);

        Medico medico = medicoRepositorio.findById(id).orElseThrow(
                () -> new EntityNotFoundException("El medico que desea eliminar no existe.")
        );

        if (medico.getEstado() == ESTADO_ELIMINADO) {
            throw new IllegalArgumentException("El medico ya se encuentra eliminado.");
        }

        medicoRepositorio.eliminarLogicamente(id);
    }

    @Transactional
    @Override
    public void cambiarEstado(Integer id, EntidadEstado estado) {

        validarId(id);

        if (estado == null) {
            throw new IllegalArgumentException("El estado es obligatorio.");
        }

        Medico medico = medicoRepositorio.findById(id).orElseThrow(
                () -> new EntityNotFoundException("El medico que desea cambiarle el estado no existe.")
        );

        if (medico.getEstado() == ESTADO_ELIMINADO) {
            throw new IllegalArgumentException("No se puede cambiar el estado de un medico eliminado.");
        }

        switch (estado) {

            case ACTIVO -> {
                if (medico.getEstado() == ESTADO_ACTIVO) {
                    throw new IllegalArgumentException("El medico ya se encuentra activo.");
                }

                if (medico.getEmpleado().getEstado() != ESTADO_ACTIVO) {
                    throw new IllegalArgumentException("No se puede activar al doctor porque su empleado no está activo.");
                }

                medicoRepositorio.activarLogicamente(id);
            }

            case INACTIVO -> {
                if (medico.getEstado() == ESTADO_INACTIVO) {
                    throw new IllegalArgumentException("El medico ya se encuentra inactivo.");
                }
                medicoRepositorio.desactivarLogicamente(id);
            }

            default -> throw new IllegalArgumentException("Solo se permite cambiar a estado ACTIVO o INACTIVO.");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public DisponibilidadCodigosDTO verificarDisponibilidad(String numeroColegiatura, String numeroEspecialidad) {
        boolean colegiaturaDisponible = !medicoRepositorio.existsByNumeroColegiatura(numeroColegiatura);

        boolean especialidadDisponible = numeroEspecialidad == null
                || numeroEspecialidad.isBlank()
                || !medicoRepositorio.existsByNumeroEspecialidad(numeroEspecialidad);

        return new DisponibilidadCodigosDTO(colegiaturaDisponible, especialidadDisponible);
    }

    private void validarId(Integer id) {

        if (id == null || id <= 0) {
            throw new IllegalArgumentException("El ID del medico debe ser válido.");
        }

    }

    private Especialidad obtenerEspecialidadActiva(Integer idEspecialidad) {

        return especialidadRepositorio.findByIdAndEstado(idEspecialidad, ESTADO_ACTIVO).orElseThrow(
                () -> new EntityNotFoundException("La especialidad seleccionada no existe o no está activa.")
        );

    }

}