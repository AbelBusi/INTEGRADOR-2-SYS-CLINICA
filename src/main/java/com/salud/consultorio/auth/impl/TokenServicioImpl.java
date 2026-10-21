package com.salud.consultorio.auth.impl;

import com.salud.consultorio.auth.service.ITokenServicio;
import com.salud.consultorio.repository.ITokenRepositorio;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TokenServicioImpl implements ITokenServicio {

    private final ITokenRepositorio tokenRepositorio;

    @Override
    public void revocarPorRol(Integer idRol) {
        tokenRepositorio.revocarPorRol(idRol);
    }
}