package com.salud.consultorio.service;

import com.salud.consultorio.dto.paciente.*;
import com.salud.consultorio.dto.paciente.NombrePacientesDTO;
import com.salud.consultorio.model.entity.Paciente;

import java.util.List;
import java.util.Optional;

public interface IPacienteServicio{


    List<NombrePacientesDTO> listarPacientesDtoList();

    PacienteDetalleLeerDTO traerPacientePorId(Integer id);

    List<PacienteLeerDTO> listarPacientes();

    PacienteRespuestaDTO actualizarRespuesta(PacienteActualizarDTO actualizarDTO, Integer id);

    Optional<Paciente> obtenerPorId(Integer id);

    Optional<Paciente> obtenerPorUsuario(String usuario);

    Boolean existePaciente(Integer id);

    PacienteRespuestaDTO crear(PacienteCrearDTO dto);

    void eliminarPorId(Integer id);

    List<PacienteLeerDTO> listarPacientesActivos();

    List<PacienteLeerDTO> listarPacientesInativos();

    boolean existeNrCodigoAegurado(String codigo);

}
