package com.salud.consultorio.impl;

import com.salud.consultorio.dto.especialidad.*;
import com.salud.consultorio.model.mapper.IEspecialidadMapper;
import com.salud.consultorio.model.entity.Especialidad;
import com.salud.consultorio.repository.IEspecialidadRepositorio;
import com.salud.consultorio.service.IEspecialidadServicio;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EspecialidadServicioImpl implements IEspecialidadServicio {

    private final IEspecialidadRepositorio especialidadRepositorio;
    private final IEspecialidadMapper especialidadMapper;

    @Transactional(readOnly = true)
    @Override
    public List<EspecialidadLeerDTO> listarTodos() {

        return especialidadRepositorio.leerEspecialidades();

    }

    @Transactional(readOnly = true)
    @Override
    public List<EspecialidadLeerDTO> listarActivos() {
        return especialidadRepositorio.leerEspecialidadesActivas();
    }

    @Transactional(readOnly = true)
    @Override
    public List<EspecialidadLeerDTO> listarInactivo() {
        return especialidadRepositorio.leerEspecialidadesInactivas();
    }

    @Transactional(readOnly = true)
    @Override
    public EspecialidadLeerDTO leerPorId(Integer id) {
        return especialidadRepositorio.leerEspecialidadPorId(id).orElseThrow(
                ()-> new EntityNotFoundException("No existe la especialidad en la entidad")
        );
    }

    @Transactional(readOnly = true)
    @Override
    public Optional<Especialidad> obtenerPorId(Integer integer) {

        return especialidadRepositorio.findById(integer);

    }

    @Transactional
    @Override
    public EspecialidadRespuestaDTO crear(EspecialidadCrearDTO dto) {

        if (existeEspecialidadNombre(dto.getNombre())){

            throw new DataIntegrityViolationException("No se puede tener dos especialidades con el mismo nombre");

        }

        Especialidad especialidad = especialidadMapper.especialidadDtoToEspecialidad(dto);

        Especialidad guardado = especialidadRepositorio.save(especialidad);

        return especialidadMapper.toDto(guardado);
    }

    @Transactional
    @Override
    public EspecialidadRespuestaDTO actualizar(EspecialidadActualizarDTO dto, Integer id) {

        Especialidad especialidad = obtenerPorId(id).orElseThrow(
                ()-> new EntityNotFoundException("No se encuentra la especialidad en la entidad")
        );

        especialidadMapper.updateFromDto(dto, especialidad);

        return especialidadMapper.toDto(especialidad);

    }

    @Transactional
    @Override
    public void eliminarPorId(Integer id) {

        if (!especialidadRepositorio.existsById(id)) {
            throw new RuntimeException("Especialidad no encontrada en la entidad ");
        }

        especialidadRepositorio.EspecialidadCambiarEstado(0,id);
    }

    @Transactional(readOnly = true)
    @Override
    public boolean existeEspecialidad(Integer id) {
        return especialidadRepositorio.existsById(id);
    }

    @Transactional(readOnly = true)
    @Override
    public boolean existeEspecialidadNombre(String nombre) {
        return especialidadRepositorio.existsByNombre(nombre);
    }

    @Transactional(readOnly = true)
    @Override
    public List<NombreEspecialidadesDTO> listaNombres() {
        return especialidadRepositorio.listarEspecialidades();
    }
}