package com.salud.consultorio.impl;

import com.salud.consultorio.dto.especialidad.*;
import com.salud.consultorio.model.entity.Especialidad;
import com.salud.consultorio.model.enums.EntidadEstado;
import com.salud.consultorio.model.mapper.IEspecialidadMapper;
import com.salud.consultorio.repository.IEspecialidadRepositorio;
import com.salud.consultorio.service.IEspecialidadServicio;
import com.salud.consultorio.service.IMedicoServicio;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EspecialidadServicioImpl implements IEspecialidadServicio {

    private final IEspecialidadRepositorio especialidadRepositorio;
    private final IEspecialidadMapper especialidadMapper;
    private final IMedicoServicio medicoServicio;

    @Transactional(readOnly = true)
    @Override
    public List<EspecialidadRespuestaDTO> lista(EntidadEstado estado) {
        return listaPorEstado(estado);
    }

    @Transactional
    @Override
    public List<EspecialidadResumenDTO> listaResumen() {
        return especialidadRepositorio.listaPorNombreResumen();
    }

    @Transactional(readOnly = true)
    @Override
    public EspecialidadRespuestaDTO entidadPorID(Integer integer) {

        return especialidadRepositorio.findById(integer).map(
                especialidadMapper::toDto
        ).orElseThrow(() -> new EntityNotFoundException("No existe la especialidad"));

    }

    @Transactional
    @Override
    public EspecialidadRespuestaDTO crear(EspecialidadCrearDTO dto) {

        if (existeEspecialidadNombre(dto.nombre())){

            throw new DataIntegrityViolationException("No se puede tener dos especialidades con el mismo nombre");

        }

        Especialidad especialidad = especialidadMapper.toEntity(dto);

        Especialidad guardado = especialidadRepositorio.save(especialidad);

        return especialidadMapper.toDto(guardado);

    }

    @Transactional
    @Override
    public EspecialidadRespuestaDTO actualizar(EspecialidadActualizarDTO dto, Integer id) {

        Especialidad especialidad = especialidadRepositorio.findById(id).orElseThrow(
                ()-> new EntityNotFoundException("No se encuentra la especialidad en la entidad")
        );

        validarDatosUnicos(dto,id);

        especialidadMapper.updateFromDto(dto, especialidad);

        return especialidadMapper.toDto(especialidad);

    }

    @Transactional
    @Override
    public void eliminarPorId(Integer id) {

        if (!especialidadRepositorio.existsById(id)) {
            throw new RuntimeException("Especialidad no encontrada en la entidad ");
        }

        if (medicoServicio.existeMedicoPorEspecialidad(id)) {
            throw new RuntimeException(
                    "No se puede eliminar la especialidad porque está siendo utilizada por un médico"
            );
        }

        especialidadRepositorio.eliminarLogicamente(id);

    }

    @Transactional(readOnly = true)
    @Override
    public boolean existeEspecialidadNombre(String nombre) {
        return especialidadRepositorio.existsByNombre(nombre);
    }

    @Transactional
    @Override
    public void cambiarEstado(Integer id, EntidadEstado estado) {

        Especialidad especialidad = validarCambiarEstado(id, estado);

        if (especialidad.getEstado() == 0) {
            throw new IllegalArgumentException("No se puede cambiar el estado de un cargo eliminado.");
        }

        if (estado == EntidadEstado.ACTIVO) {

            if (especialidad.getEstado() == 1) {
                throw new IllegalArgumentException("No se puede activar un estado que ya se encuentra Activo");
            }

            especialidadRepositorio.activarLogicamente(especialidad.getId());

        }

        if (estado == EntidadEstado.INACTIVO) {

            if (especialidad.getEstado() == 2) {
                throw new IllegalArgumentException("No se puede desactivar un estado que ya se encuentra desactivado");
            }

            especialidadRepositorio.desactivarLogicamente(especialidad.getId());

        }

    }

    @Transactional(readOnly = true)
    private Especialidad validarCambiarEstado(Integer id, EntidadEstado estado) {

        if (id == null || estado == null) {
            throw new IllegalArgumentException("El id y el estado son obligatorios.");
        }

        return especialidadRepositorio.findById(id).orElseThrow(
                () -> new EntityNotFoundException("El estado que desea cambiarle el estado, no existe.")
        );

    }


    @Transactional(readOnly = true)
    private List<EspecialidadRespuestaDTO> listaPorEstado(EntidadEstado estado) {

        if (estado != null) {

            if (estado == EntidadEstado.ACTIVO) {

                return especialidadRepositorio.listaPorEstado(1);

            }

            if (estado == EntidadEstado.INACTIVO) {

                return especialidadRepositorio.listaPorEstado(2);

            }

        }

        return especialidadRepositorio.listaPorEstadoActivoInactivo();

    }

    @Transactional(readOnly = true)
    private void validarDatosUnicos(EspecialidadActualizarDTO dto, Integer id) {

        if (especialidadRepositorio.existsByNombreAndIdNot(
                dto.nombre(), id)) {

            throw new DataIntegrityViolationException(
                    "El nombre ya pertenece a otra especialidad."
            );
        }

    }

}