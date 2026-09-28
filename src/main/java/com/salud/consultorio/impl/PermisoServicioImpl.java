package com.salud.consultorio.impl;

import com.salud.consultorio.dto.rol.RolRespuestaDTO;
import com.salud.consultorio.repository.IPermisoRepositorio;
import com.salud.consultorio.service.IPermisoServicio;
import com.salud.consultorio.service.IRolServicio;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PermisoServicioImpl implements IPermisoServicio {

    private IPermisoRepositorio permisoRepositorio;
    private IRolServicio rolServicio;

    @Transactional(readOnly = true)
    @Override
    public List<RolRespuestaDTO> listaPermisosPorRolId(Integer id) {

        if (!rolServicio.existeRolId(id)){
            throw new EntityNotFoundException("No existe el rol en la entidad");
        }

        return null;
    }

}