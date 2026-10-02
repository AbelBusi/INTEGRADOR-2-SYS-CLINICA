package com.salud.consultorio.impl;

import com.salud.consultorio.dto.doctor.*;
import com.salud.consultorio.model.entity.Doctor;
import com.salud.consultorio.model.entity.Empleado;
import com.salud.consultorio.model.entity.Especialidad;
import com.salud.consultorio.model.enums.EntidadEstado;
import com.salud.consultorio.model.mapper.IDoctorMapper;
import com.salud.consultorio.repository.IDoctorRepositorio;
import com.salud.consultorio.repository.IEmpleadoRepositorio;
import com.salud.consultorio.repository.IEspecialidadRepositorio;
import com.salud.consultorio.service.IDoctorServicio;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DoctorServicioImpl implements IDoctorServicio {

    private static final int ESTADO_ELIMINADO = 0;
    private static final int ESTADO_ACTIVO = 1;
    private static final int ESTADO_INACTIVO = 2;

    private final IDoctorRepositorio doctorRepositorio;
    private final IEmpleadoRepositorio empleadoRepositorio;
    private final IEspecialidadRepositorio especialidadRepositorio;
    private final IDoctorMapper doctorMapper;

    @Transactional(readOnly = true)
    @Override
    public DoctorDetalleDTO entidadPorID(Integer id) {

        validarId(id);

        return doctorRepositorio.buscarDetallePorId(id)
                .orElseThrow(() ->
                        new EntityNotFoundException("No se encontró el doctor con ID: " + id)
                );
    }

    @Transactional(readOnly = true)
    @Override
    public List<DoctorLeerDTO> lista(EntidadEstado estado) {

        if (estado == EntidadEstado.ACTIVO) {
            return doctorRepositorio.listaPorEstado(ESTADO_ACTIVO);
        }

        if (estado == EntidadEstado.INACTIVO) {
            return doctorRepositorio.listaPorEstado(ESTADO_INACTIVO);
        }

        return doctorRepositorio.listaPorEstadoActivoInactivo();
    }

    @Transactional
    @Override
    public DoctorRespuestaDTO crear(DoctorCrearDTO dto) {

        if (dto == null || dto.idEmpleado() == null || dto.idEspecialidad() == null) {
            throw new IllegalArgumentException("Los datos del doctor son obligatorios.");
        }

        Empleado empleado = empleadoRepositorio.findById(dto.idEmpleado()).orElseThrow(
                () -> new EntityNotFoundException("El empleado seleccionado no existe.")
        );

        if (empleado.getEstado() != ESTADO_ACTIVO) {
            throw new IllegalArgumentException("Solo se puede registrar como doctor a un empleado activo.");
        }

        if (doctorRepositorio.existsByEmpleadoId(empleado.getId())) {
            throw new DataIntegrityViolationException("El empleado ya se encuentra registrado como doctor.");
        }

        if (doctorRepositorio.existsByNumeroColegiatura(dto.numeroColegiatura())) {
            throw new DataIntegrityViolationException("El número de colegiatura ya pertenece a otro doctor.");
        }

        Especialidad especialidad = obtenerEspecialidadActiva(dto.idEspecialidad());

        Doctor doctor = doctorMapper.toEntity(dto);

        doctor.setEmpleado(empleado);
        doctor.setEspecialidad(especialidad);

        Doctor guardado = doctorRepositorio.save(doctor);

        return doctorMapper.toDto(guardado);
    }

    @Transactional
    @Override
    public DoctorRespuestaDTO actualizar(DoctorActualizarDTO dto, Integer id) {

        validarId(id);

        if (dto == null || dto.idEspecialidad() == null) {
            throw new IllegalArgumentException("Los datos del doctor son obligatorios.");
        }

        Doctor doctor = doctorRepositorio.findById(id).orElseThrow(
                () -> new EntityNotFoundException("El doctor que desea actualizar no existe.")
        );

        if (doctor.getEstado() == ESTADO_ELIMINADO) {
            throw new IllegalArgumentException("No se puede actualizar un doctor eliminado.");
        }

        if (doctorRepositorio.existsByNumeroColegiaturaAndIdNot(dto.numeroColegiatura(), id)) {
            throw new DataIntegrityViolationException("El número de colegiatura ya pertenece a otro doctor.");
        }

        // Solo se consulta la especialidad si realmente cambió.
        if (!doctor.getEspecialidad().getId().equals(dto.idEspecialidad())) {
            doctor.setEspecialidad(obtenerEspecialidadActiva(dto.idEspecialidad()));
        }

        doctorMapper.updateFromDto(dto, doctor);

        return doctorMapper.toDto(doctor);
    }

    @Transactional
    @Override
    public void eliminarPorId(Integer id) {

        validarId(id);

        Doctor doctor = doctorRepositorio.findById(id).orElseThrow(
                () -> new EntityNotFoundException("El doctor que desea eliminar no existe.")
        );

        if (doctor.getEstado() == ESTADO_ELIMINADO) {
            throw new IllegalArgumentException("El doctor ya se encuentra eliminado.");
        }

        doctorRepositorio.eliminarLogicamente(id);
    }

    @Transactional
    @Override
    public void cambiarEstado(Integer id, EntidadEstado estado) {

        validarId(id);

        if (estado == null) {
            throw new IllegalArgumentException("El estado es obligatorio.");
        }

        Doctor doctor = doctorRepositorio.findById(id).orElseThrow(
                () -> new EntityNotFoundException("El doctor que desea cambiarle el estado no existe.")
        );

        if (doctor.getEstado() == ESTADO_ELIMINADO) {
            throw new IllegalArgumentException("No se puede cambiar el estado de un doctor eliminado.");
        }

        switch (estado) {

            case ACTIVO -> {
                if (doctor.getEstado() == ESTADO_ACTIVO) {
                    throw new IllegalArgumentException("El doctor ya se encuentra activo.");
                }

                // Un doctor solo puede estar activo si su empleado también lo está.
                if (doctor.getEmpleado().getEstado() != ESTADO_ACTIVO) {
                    throw new IllegalArgumentException("No se puede activar al doctor porque su empleado no está activo.");
                }

                doctorRepositorio.activarLogicamente(id);
            }

            case INACTIVO -> {
                if (doctor.getEstado() == ESTADO_INACTIVO) {
                    throw new IllegalArgumentException("El doctor ya se encuentra inactivo.");
                }
                doctorRepositorio.desactivarLogicamente(id);
            }

            default -> throw new IllegalArgumentException("Solo se permite cambiar a estado ACTIVO o INACTIVO.");
        }
    }

    private void validarId(Integer id) {

        if (id == null || id <= 0) {
            throw new IllegalArgumentException("El ID del doctor debe ser válido.");
        }

    }

    private Especialidad obtenerEspecialidadActiva(Integer idEspecialidad) {

        return especialidadRepositorio.findByIdAndEstado(idEspecialidad, ESTADO_ACTIVO).orElseThrow(
                () -> new EntityNotFoundException("La especialidad seleccionada no existe o no está activa.")
        );

    }

}