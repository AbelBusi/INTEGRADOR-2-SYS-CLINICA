package com.salud.consultorio.service;

import com.salud.consultorio.dto.persona.PersonaCrearDTO;
import com.salud.consultorio.dto.persona.PersonaLeerDTO;
import com.salud.consultorio.model.entity.Persona;

import java.util.List;
import java.util.Optional;

public interface IPersonaServicio{

    List<Persona> listarTodos();

    List<PersonaLeerDTO> listarPersonasSinCuenta();

    Optional<Persona> obtenerPorId(Integer id);

    Persona crear(PersonaCrearDTO dto);

    Persona actualizar(PersonaCrearDTO dto, Integer id);

    void eliminarPorId(Integer id);

    boolean existePersonaDni(String dni);

    boolean existePersonaCorreo(String correo);

}
