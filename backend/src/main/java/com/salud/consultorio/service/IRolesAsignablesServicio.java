package com.salud.consultorio.service;

import com.salud.consultorio.dto.usuario.PersonaBusquedaUsuarioDTO;
import com.salud.consultorio.dto.usuario.PersonaUsuarioDTO;
import com.salud.consultorio.dto.usuario.RolesAsignablesDTO;

import java.util.List;

public interface IRolesAsignablesServicio {

    List<PersonaUsuarioDTO> listarPersonasSinUsuario();

    List<PersonaBusquedaUsuarioDTO> buscar(String busqueda);

    RolesAsignablesDTO obtener(Integer idPersona);
}