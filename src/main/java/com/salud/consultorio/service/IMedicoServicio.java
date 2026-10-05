package com.salud.consultorio.service;

import com.salud.consultorio.dto.medico.*;
import com.salud.consultorio.model.enums.EntidadEstado;

import java.util.List;

public interface IMedicoServicio {

    MedicoDetalleDTO entidadPorID(Integer id);

    List<MedicoLeerDTO> lista(EntidadEstado estado);

    MedicoRespuestaDTO crear(MedicoCrearDTO dto);

    MedicoRespuestaDTO actualizar(MedicoActualizarDTO dto, Integer id);

    void eliminarPorId(Integer id);

    void cambiarEstado(Integer id, EntidadEstado estado);

}