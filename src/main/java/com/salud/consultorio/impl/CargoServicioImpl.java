package com.salud.consultorio.impl;

import com.salud.consultorio.dto.cargo.CargoActualizarDTO;
import com.salud.consultorio.dto.cargo.CargoCrearDTO;
import com.salud.consultorio.dto.cargo.CargoRespuestaDTO;
import com.salud.consultorio.dto.paciente.PacienteLeerDTO;
import com.salud.consultorio.model.enums.EntidadEstado;
import com.salud.consultorio.model.mapper.ICargoMapper;
import com.salud.consultorio.repository.ICargoRepositorio;
import com.salud.consultorio.service.ICargoServicio;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CargoServicioImpl implements ICargoServicio  {

    private final ICargoRepositorio cargoRepositorio;
    private final ICargoMapper cargoMapper;

    @Transactional(readOnly = true)
    @Override
    public List<CargoRespuestaDTO> lista(EntidadEstado estado) {
        return listaPorEstado(estado);
    }

    @Transactional(readOnly = true)
    @Override
    public CargoRespuestaDTO entidadPorID(Integer id) {
        return null;
    }

    @Transactional
    @Override
    public CargoRespuestaDTO crear(CargoCrearDTO dto) {
        return null;
    }

    @Transactional
    @Override
    public CargoRespuestaDTO actualizar(CargoActualizarDTO dto) {
        return null;
    }

    @Transactional
    @Override
    public void eliminarPorId(Integer id) {

    }

    @Transactional
    @Override
    public void cambiarEstado(Integer id, EntidadEstado estado) {

    }

    @Transactional(readOnly = true)
    private List<CargoRespuestaDTO> listaPorEstado(EntidadEstado estado) {

        if (estado != null) {

            if (estado == EntidadEstado.ACTIVO) {

                return cargoRepositorio.listaPorEstado(1);

            }

            if (estado == EntidadEstado.INACTIVO) {

                return cargoRepositorio.listaPorEstado(2);

            }

        }

        return cargoRepositorio.listaPorEstadoActivoInactivo();

    }

}