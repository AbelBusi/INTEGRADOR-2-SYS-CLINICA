package com.salud.consultorio.service;

import com.salud.consultorio.dto.paciente.*;
import com.salud.consultorio.dto.paciente.NombrePacientesDTO;
import com.salud.consultorio.model.entity.Paciente;
import com.salud.consultorio.model.enums.EntidadEstado;

import java.util.List;
import java.util.Optional;

public interface IPacienteServicio{


    List<NombrePacientesDTO> listarPacientesDtoList();

    PacienteDetalleDTO traerPacientePorId(Integer id);

    List<PacienteLeerDTO> lista(EntidadEstado estado);

    PacienteRespuestaDTO actualizar(PacienteActualizarDTO actualizarDTO, Integer id);

    Optional<Paciente> obtenerPorId(Integer id);

    Optional<Paciente> obtenerPorUsuario(String usuario);

    Boolean existePaciente(Integer id);

    PacienteRespuestaDTO crear(PacienteCrearDTO dto);

    void eliminarPorId(Integer id);

    boolean existeNrCodigoAegurado(String codigo);

    void cambiarEstado(Integer id, EntidadEstado estado);

}
