package com.salud.consultorio.auth.impl;

import com.salud.consultorio.model.entity.IntentoAutorregistro;
import com.salud.consultorio.repository.IIntentoAutorregistroRepositorio;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class RegistroIntentoServicio {

    private static final int MAX_FALLOS = 5;
    private static final int VENTANA_MINUTOS = 30;

    private final IIntentoAutorregistroRepositorio repositorio;

    /** Transacción propia: el fallo se conserva aunque la operación principal haga rollback. */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void registrarFallo(Integer idPersona) {
        repositorio.save(IntentoAutorregistro.builder().idPersona(idPersona).build());
    }

    @Transactional(readOnly = true)
    public boolean bloqueado(Integer idPersona) {
        return repositorio.countByIdPersonaAndFechaIntentoAfter(
                idPersona, LocalDateTime.now().minusMinutes(VENTANA_MINUTOS)) >= MAX_FALLOS;
    }
}