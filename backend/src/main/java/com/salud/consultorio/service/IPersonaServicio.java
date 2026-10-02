package com.salud.consultorio.service;

import com.salud.consultorio.dto.persona.PersonaActualizarDTO;
import com.salud.consultorio.dto.persona.PersonaCrearDTO;
import com.salud.consultorio.model.entity.Persona;

public interface IPersonaServicio{

    Persona crear(PersonaCrearDTO dto);

    Persona actualizar(PersonaActualizarDTO dto, Integer id);

    boolean existePersonaNumeroDocumento(String dni);

    boolean existePersonaCorreo(String correo);

}
