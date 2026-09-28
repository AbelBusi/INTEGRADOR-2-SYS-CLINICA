package com.salud.consultorio.impl;

import com.salud.consultorio.dto.rol.RolRespuestaDTO;
import com.salud.consultorio.model.mapper.IRolMapper;
import com.salud.consultorio.repository.IRolRepositorio;
import com.salud.consultorio.service.IRolServicio;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RolServicioImpl implements IRolServicio {

    private final IRolRepositorio rolRepositorio;
    private final IRolMapper rolMapper;

    @Transactional(readOnly = true)
    @Override
    public List<RolRespuestaDTO> leerTodos() {

        return rolRepositorio.findAll().stream()
                .map(rolMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    @Override
    public boolean existeRolId(Integer id) {
        return rolRepositorio.existsById(id);
    }

}