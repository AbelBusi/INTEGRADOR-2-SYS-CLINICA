package com.salud.consultorio.impl;

import com.salud.consultorio.dto.persona.PersonaCrearDTO;
import com.salud.consultorio.dto.persona.PersonaLeerDTO;
import com.salud.consultorio.model.entity.Persona;
import com.salud.consultorio.model.mapper.IPersonaMapper;
import com.salud.consultorio.repository.IPersonaRepositorio;
import com.salud.consultorio.service.IPersonaServicio;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PersonaServicioImpl implements IPersonaServicio {

    private final IPersonaRepositorio personaRepositorio;
    private final IPersonaMapper personaMapper;

    @Transactional(readOnly = true)
    @Override
    public List<Persona> listarTodos() {
        return personaRepositorio.findAll();
    }

    @Transactional(readOnly = true)
    @Override
    public List<PersonaLeerDTO> listarPersonasSinCuenta() {
        return personaRepositorio.listarPersonasSinCuenta();
    }

    @Override
    public Optional<Persona> obtenerPorId(Integer integer) {
        return personaRepositorio.findById(integer);
    }

    @Transactional
    @Override
    public Persona crear(PersonaCrearDTO personaCrearDTO) {

        Persona persona =personaMapper.personaDtoToPersona(personaCrearDTO);

        return personaRepositorio.save(persona);
    }

    @Override
    public Persona actualizar(PersonaCrearDTO personaCrearDTO, Integer id) {
        return null;
    }

    @Override
    public void eliminarPorId(Integer integer) {

    }

    @Transactional(readOnly = true)
    @Override
    public boolean existePersonaDni(String dni) {
        return personaRepositorio.existsByDni(dni);
    }

    @Transactional(readOnly = true)
    @Override
    public boolean existePersonaCorreo(String correo) {
        return personaRepositorio.existsByCorreo(correo);
    }

}
