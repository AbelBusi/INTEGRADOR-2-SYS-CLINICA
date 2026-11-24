package com.salud.consultorio.impl;

import com.salud.consultorio.service.IVerificacionDobleFactorServicio;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;


@Service
public class VerificacionCodigoTemporalServicioImpl implements IVerificacionDobleFactorServicio {

    private final byte[] codigoTemporal;

    public VerificacionCodigoTemporalServicioImpl(
            @Value("${descanso-medico.verificacion.codigo-temporal:123456}") String codigoTemporal) {
        this.codigoTemporal = codigoTemporal.getBytes(StandardCharsets.UTF_8);
    }

    @Override
    public String metodo() {
        return "CODIGO_TEMPORAL";
    }

    @Override
    public boolean verificar(Integer idUsuario, String codigo) {
        if (codigo == null) {
            return false;
        }
        return MessageDigest.isEqual(codigoTemporal, codigo.getBytes(StandardCharsets.UTF_8));
    }
}