package com.salud.consultorio.service;

import com.salud.consultorio.dto.usuario.PersonaUsuarioDTO;
import com.salud.consultorio.dto.usuario.RolesAsignablesDTO;

import java.util.List;

public interface IRolesAsignablesServicio {

    List<PersonaUsuarioDTO> listarPersonasSinUsuario();

    RolesAsignablesDTO obtener(Integer idPersona);
}