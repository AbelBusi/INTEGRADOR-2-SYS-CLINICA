package com.salud.consultorio.impl;

import com.salud.consultorio.dto.cargo.*;
import com.salud.consultorio.dto.paciente.PacienteActualizarDTO;
import com.salud.consultorio.dto.tipoDocumento.TipoDocumentoResumenDTO;
import com.salud.consultorio.model.entity.Cargo;
import com.salud.consultorio.model.entity.Paciente;
import com.salud.consultorio.model.enums.EntidadEstado;
import com.salud.consultorio.model.mapper.ICargoMapper;
import com.salud.consultorio.repository.ICargoRepositorio;
import com.salud.consultorio.service.ICargoServicio;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
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
        return cargoRepositorio.findById(id).map(
                cargoMapper::toDto
        ).orElseThrow( () -> new EntityNotFoundException("El cargo no existe."));
    }

    @Transactional
    @Override
    public CargoRespuestaDTO crear(CargoCrearDTO dto) {

        if (cargoRepositorio.existsByNombre(dto.nombre())){
            throw new DataIntegrityViolationException("No se puede duplicar un cargo");
        }

        Cargo cargo = cargoMapper.toEntity(dto);


        cargoRepositorio.save(cargo);

        return cargoMapper.toDto(cargo);

    }

    @Transactional
    @Override
    public CargoRespuestaDTO actualizar(CargoActualizarDTO dto, Integer id) {

        Cargo cargo = cargoRepositorio.findById(id).orElseThrow(
                ()-> new EntityNotFoundException("El cargo no existe")
        );

        validarDatosUnicos(dto,id);

        cargoMapper.updateFromDto(dto, cargo);

        return cargoMapper.toDto(cargo);

    }

    @Transactional
    @Override
    public void eliminarPorId(Integer id) {

        if (!cargoRepositorio.existsById(id)) {

            throw new EntityNotFoundException("El cargo que desea eliminar no existe.");

        }

        cargoRepositorio.eliminarLogicamente(id);

    }

    @Transactional
    @Override
    public void cambiarEstado(Integer id, EntidadEstado estado) {

        Cargo cargo = validarCambiarEstado(id, estado);

        if (cargo.getEstado() == 0) {
            throw new IllegalArgumentException("No se puede cambiar el estado de un cargo eliminado.");
        }

        if (estado == EntidadEstado.ACTIVO) {

            if (cargo.getEstado() == 1) {
                throw new IllegalArgumentException("No se puede activar un estado que ya se encuentra Activo");
            }

            cargoRepositorio.activarLogicamente(cargo.getId());

        }

        if (estado == EntidadEstado.INACTIVO) {

            if (cargo.getEstado() == 2) {
                throw new IllegalArgumentException("No se puede desactivar un estado que ya se encuentra desactivado");
            }

            cargoRepositorio.desactivarLogicamente(cargo.getId());

        }

    }

    @Transactional(readOnly = true)
    @Override
    public List<CargoResumenDTO> listaResumen() {
        return cargoRepositorio.listaResumenDatos();
    }

    @Transactional(readOnly = true)
    @Override
    public List<CargoMedicoResumenDTO> listaCargoMedicoResumen() {
        return cargoRepositorio.listaResumenCargoMedico();
    }

    @Transactional(readOnly = true)
    private Cargo validarCambiarEstado(Integer id, EntidadEstado estado) {

        if (id == null || estado == null) {
            throw new IllegalArgumentException("El id y el estado son obligatorios.");
        }

        return cargoRepositorio.findById(id).orElseThrow(
                () -> new EntityNotFoundException("El estado que desea cambiarle el estado, no existe.")
        );

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

    @Transactional(readOnly = true)
    private void validarDatosUnicos(CargoActualizarDTO dto, Integer id) {

        if (cargoRepositorio.existsByNombreAndIdNot(
                dto.nombre(), id)) {

            throw new DataIntegrityViolationException(
                    "El nombre ya pertenece a otro cargo"
            );
        }

    }

}