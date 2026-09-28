package com.salud.consultorio.impl;

import com.salud.consultorio.dto.recepcionista.*;
import com.salud.consultorio.model.entity.Persona;
import com.salud.consultorio.model.entity.Recepcionista;
import com.salud.consultorio.model.mapper.IPersonaMapper;
import com.salud.consultorio.model.mapper.IRecepnionistaMapper;
import com.salud.consultorio.repository.IRecepcionistaRepositorio;
import com.salud.consultorio.service.IPersonaServicio;
import com.salud.consultorio.service.IRecepcionistaServicio;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RecepcionistaServicioImpl implements IRecepcionistaServicio {

    private final IRecepcionistaRepositorio recepcionistaRepositorio;
    private final IPersonaServicio personaServicio;
    private final IRecepnionistaMapper recepnionistaMapper;
    private final IPersonaMapper personaMapper;

    @Transactional(readOnly = true)
    @Override
    public List<Recepcionista> listarTodos() {
        return recepcionistaRepositorio.findAll();
    }

    @Transactional(readOnly = true)
    @Override
    public Optional<Recepcionista> obtenerPorId(Integer integer) {
        return recepcionistaRepositorio.findById(integer);
    }

    @Transactional
    @Override
    public RecepcionistaRespuestaDTO crear(RecepcionistaCrearDTO dto) {

        if (personaServicio.existePersonaDni(dto.getPersona().getDni())){

            throw new DataIntegrityViolationException("No se puede duplicar el dni, el trabajador ya se encuentra registrado");

        }

        if (existeCodigo(dto.getCodigoEmpleado())){

            throw new DataIntegrityViolationException("No se puede duplicar el codigo de un empleado");

        }

        Recepcionista recepcionista = recepnionistaMapper.recepcionistaDtoToRecepcionista(dto);

        Persona persona = personaMapper.personaDtoToPersona(dto.getPersona());

        recepcionista.setPersona(persona);

        Recepcionista guardado = recepcionistaRepositorio.save(recepcionista);

        return recepnionistaMapper.toDto(guardado);

    }

    @Transactional
    @Override
    public RecepcionistaRespuestaDTO actualizar(RecepcionistaActualizarDTO dto, Integer id) {

        Recepcionista recepcionista = recepcionistaRepositorio.findByIdConRecepcionista(id).orElseThrow(
                ()-> new EntityNotFoundException("No existe el recepcionista ")
        );

        recepnionistaMapper.updateFromDto(dto,recepcionista);

        personaMapper.updateFromDto(dto.getPersona(),recepcionista.getPersona());

        return recepnionistaMapper.toDto(recepcionista);
    }

    @Transactional(readOnly = true)
    @Override
    public boolean existeCodigo(String codigo) {
        return recepcionistaRepositorio.existsByCodigoEmpleado(codigo);
    }

    @Transactional
    @Override
    public void eliminarPorId(Integer integer) {

        if (!existeRecepcionista(integer)){

            throw new EntityNotFoundException("Recepcionista no se encuentra en la entidad");

        }

        recepcionistaRepositorio.RecepcionistaCambiarEstado(0,integer);

    }

    @Transactional(readOnly = true)
    @Override
    public RecepcionistaLeerDTO leerPorId(Integer id) {
        return recepcionistaRepositorio.leerRecepcionistaPorId(id).orElseThrow(
                () -> new EntityNotFoundException("No existe el recepcionista en la entidad")
        );
    }

    @Transactional(readOnly = true)
    @Override
    public RecepcionistaDetalleLeerDTO obtenerDetallePorId(Integer id) {
        return recepcionistaRepositorio.obtenerDetallePorId(id).orElseThrow(
                () -> new EntityNotFoundException("No existe el recepcionista en la entidad")
        );
    }

    @Transactional(readOnly = true)
    @Override
    public Optional<Recepcionista> obtenerPorUsuario(String usuario) {
        return recepcionistaRepositorio.findByUsuario(usuario);
    }

    @Transactional(readOnly = true)
    @Override
    public List<RecepcionistaLeerDTO> listarRecepcionistasPersonas() {
        return recepcionistaRepositorio.leerRecepcionistas();
    }

    @Transactional(readOnly = true)
    @Override
    public List<RecepcionistaLeerDTO> listarRecepcionistasActivos() {
        return recepcionistaRepositorio.leerRecepcionistasActivos();
    }

    @Transactional(readOnly = true)
    @Override
    public List<RecepcionistaLeerDTO> listarRecepcionistasInactivos() {
        return recepcionistaRepositorio.leerRecepcionistasInactivos();
    }

    @Override
    public boolean existeRecepcionista(Integer id) {
        return recepcionistaRepositorio.existsById(id);
    }

    @Transactional(readOnly = true)
    @Override
    public List<NombreRecepcionistaDTO> listaNombres() {
        return recepcionistaRepositorio.listarRecepcionistasNombres();
    }
}
