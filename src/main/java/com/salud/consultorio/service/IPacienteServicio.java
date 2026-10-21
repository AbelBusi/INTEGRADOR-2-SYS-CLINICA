package com.salud.consultorio.service;

import com.salud.consultorio.dto.paciente.*;
import com.salud.consultorio.dto.usuario.PersonaUsuarioDTO;
import com.salud.consultorio.model.enums.EntidadEstado;

import java.util.List;

public interface IPacienteServicio{

    PacienteDetalleDTO entidadPorID(Integer id);

    List<PacienteLeerDTO> lista(EntidadEstado estado);

    PacienteRespuestaDTO actualizar(PacienteActualizarDTO actualizarDTO, Integer id);

    PacienteRespuestaDTO crear(PacienteCrearDTO dto);

    void eliminarPorId(Integer id);

    boolean existeNrCodigoAegurado(String codigo);

    void cambiarEstado(Integer id, EntidadEstado estado);

    List<PersonaUsuarioDTO> listarPacientesSinUusario();
}
