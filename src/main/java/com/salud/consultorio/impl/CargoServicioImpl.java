package com.salud.consultorio.impl;

import com.salud.consultorio.dto.cargo.CargoActualizarDTO;
import com.salud.consultorio.dto.cargo.CargoCrearDTO;
import com.salud.consultorio.dto.cargo.CargoRespuestaDTO;
import com.salud.consultorio.model.enums.EntidadEstado;
import com.salud.consultorio.repository.ICargoRepositorio;
import com.salud.consultorio.service.ICargoServicio;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CargoServicioImpl implements ICargoServicio  {

    private final ICargoRepositorio cargoRepositorio;

    @Override
    public List<CargoRespuestaDTO> lista(EntidadEstado estado) {
        return List.of();
    }

    @Override
    public CargoRespuestaDTO entidadPorID(Integer id) {
        return null;
    }

    @Override
    public CargoRespuestaDTO crear(CargoCrearDTO dto) {
        return null;
    }

    @Override
    public CargoRespuestaDTO actualizar(CargoActualizarDTO dto) {
        return null;
    }

    @Override
    public void eliminarPorId(Integer id) {

    }

    @Override
    public void cambiarEstado(Integer id, EntidadEstado estado) {

    }
}