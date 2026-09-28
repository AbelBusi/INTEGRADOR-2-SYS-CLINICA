package com.salud.consultorio.service;


import com.salud.consultorio.dto.especialidad.*;
import com.salud.consultorio.model.entity.Especialidad;

import java.util.List;
import java.util.Optional;

public interface IEspecialidadServicio{

    List<NombreEspecialidadesDTO> listaNombres();

    List<EspecialidadLeerDTO> listarTodos();

    List<EspecialidadLeerDTO> listarActivos();

    List<EspecialidadLeerDTO> listarInactivo();

    EspecialidadLeerDTO leerPorId(Integer id);

    Optional<Especialidad> obtenerPorId(Integer id);

    EspecialidadRespuestaDTO crear(EspecialidadCrearDTO dto);

    EspecialidadRespuestaDTO actualizar(EspecialidadActualizarDTO dto, Integer id);

    void eliminarPorId(Integer id);

    boolean existeEspecialidad(Integer id);

    boolean existeEspecialidadNombre(String nombre);

}