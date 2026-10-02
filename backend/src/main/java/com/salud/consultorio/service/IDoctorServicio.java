package com.salud.consultorio.service;

import com.salud.consultorio.dto.doctor.*;
import com.salud.consultorio.model.enums.EntidadEstado;

import java.util.List;

public interface IDoctorServicio {

    DoctorDetalleDTO entidadPorID(Integer id);

    List<DoctorLeerDTO> lista(EntidadEstado estado);

    DoctorRespuestaDTO crear(DoctorCrearDTO dto);

    DoctorRespuestaDTO actualizar(DoctorActualizarDTO dto, Integer id);

    void eliminarPorId(Integer id);

    void cambiarEstado(Integer id, EntidadEstado estado);

}