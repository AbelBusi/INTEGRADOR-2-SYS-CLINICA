package com.salud.consultorio.service;

import com.salud.consultorio.dto.empleado.*;
import com.salud.consultorio.model.entity.Empleado;
import com.salud.consultorio.model.enums.EntidadEstado;

import java.util.List;
import java.util.Optional;

public interface IEmpleadoServicio {

    EmpleadoDetalleDTO entidadPorID(Integer id);

    List<EmpleadoLeerDTO> lista(EntidadEstado estado);

    Empleado entidadPorIDTransaccion(Integer id);

    EmpleadoRespuestaDTO crear(EmpleadoCrearDTO dto);

    EmpleadoRespuestaDTO actualizar(EmpleadoActualizarDTO dto, Integer id);

    void eliminarPorId(Integer id);

    void cambiarEstado(Integer id, EntidadEstado estado);

}