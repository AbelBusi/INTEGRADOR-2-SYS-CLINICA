package com.salud.consultorio.service;

import com.salud.consultorio.dto.paciente.PacienteUsuarioEstadoDTO;
import com.salud.consultorio.dto.usuario.UsuarioCreadoDTO;

import java.util.List;

public interface IPacienteUsuarioServicio {

    List<PacienteUsuarioEstadoDTO> listarEstado();

    UsuarioCreadoDTO registrarUsuario(Integer idPaciente);

}