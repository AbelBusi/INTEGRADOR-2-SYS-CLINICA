package com.salud.consultorio.impl;

import com.salud.consultorio.model.entity.Permiso;
import com.salud.consultorio.repository.IPermisoRepositorio;
import com.salud.consultorio.service.IPermisoServicio;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PermisoServicioImpl implements IPermisoServicio {

    private final IPermisoRepositorio permisoRepositorio;

    @Transactional(readOnly = true)
    @Override
    public List<Permiso> traerPermisosExistentesPorID(List<Integer> idsPermisos) {

        if (idsPermisos == null || idsPermisos.isEmpty()){
            throw new RuntimeException("Debe contener al menos un id");
        }

        List<Permiso> lista = permisoRepositorio.findAllById(idsPermisos);

        Set<Integer> idEncontrados = lista.stream()
                .map(Permiso::getId)
                .collect(Collectors.toSet());


        List<Integer> idInexistentes = idsPermisos.stream()
                .filter(p -> !idEncontrados.contains(p))
                .distinct()
                .toList();

        if (!idInexistentes.isEmpty()){
            throw new IllegalArgumentException("No existen los siguientes permisos: " + idInexistentes);
        }

        return lista;

    }


}