package com.salud.consultorio.service;

import com.salud.consultorio.dto.recepcionista.*;
import com.salud.consultorio.model.entity.Recepcionista;

import java.util.List;
import java.util.Optional;

public interface IRecepcionistaServicio{

    List<NombreRecepcionistaDTO> listaNombres();

    List<Recepcionista> listarTodos();

    Optional<Recepcionista> obtenerPorId(Integer id);

    RecepcionistaRespuestaDTO crear(RecepcionistaCrearDTO dto);

    RecepcionistaRespuestaDTO actualizar(RecepcionistaActualizarDTO dto, Integer id);

    boolean existeCodigo(String codigo);

    void eliminarPorId(Integer id);

    RecepcionistaLeerDTO leerPorId(Integer id);

    RecepcionistaDetalleLeerDTO obtenerDetallePorId(Integer id);

    java.util.Optional<com.salud.consultorio.model.entity.Recepcionista> obtenerPorUsuario(String usuario);

    List<RecepcionistaLeerDTO> listarRecepcionistasPersonas();

    List<RecepcionistaLeerDTO> listarRecepcionistasActivos();

    List<RecepcionistaLeerDTO> listarRecepcionistasInactivos();

    boolean existeRecepcionista(Integer id);

}