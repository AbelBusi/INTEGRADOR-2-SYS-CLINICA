package com.salud.consultorio.service;

import com.salud.consultorio.dto.cargo.*;
import com.salud.consultorio.dto.tipoDocumento.TipoDocumentoResumenDTO;
import com.salud.consultorio.model.enums.EntidadEstado;

import java.util.List;

public interface ICargoServicio {

    List<CargoRespuestaDTO> lista(EntidadEstado estado);

    CargoRespuestaDTO entidadPorID(Integer id);

    CargoRespuestaDTO crear(CargoCrearDTO dto);

    CargoRespuestaDTO actualizar(CargoActualizarDTO dto, Integer id);

    void eliminarPorId(Integer id);

    void cambiarEstado(Integer id, EntidadEstado estado);

    List<CargoResumenDTO> listaResumen();

    List<CargoMedicoResumenDTO> listaCargoMedicoResumen();


}