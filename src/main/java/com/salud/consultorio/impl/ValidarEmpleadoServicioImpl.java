package com.salud.consultorio.impl;

import com.salud.consultorio.repository.IEmpleadoRepositorio;
import com.salud.consultorio.service.IValidarEmpleadoCargoServicio;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ValidarEmpleadoServicioImpl implements IValidarEmpleadoCargoServicio {

    private final IEmpleadoRepositorio empleadoRepositorio;

    @Transactional(readOnly = true)
    @Override
    public boolean existeEmpleadoPorCargo(Integer id) {
        return empleadoRepositorio.existsByCargoId(id);
    }

    @Transactional(readOnly = true)
    @Override
    public boolean existeEmpleadoID(Integer id) {
        return empleadoRepositorio.existsById(id);
    }

    @Transactional(readOnly = true)
    @Override
    public Integer IDEmpleadoPersona(Integer id) {
        return empleadoRepositorio.empleadoPersonaID(id);
    }

}