package com.salud.consultorio.impl;

import com.salud.consultorio.service.IFirmaElectronicaServicio;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.security.MessageDigest;
import java.util.HexFormat;

@Service
public class FirmaElectronicaInternaServicioImpl implements IFirmaElectronicaServicio {

    private static final String TIPO = "ELECTRONICA_INTERNA";
    private static final String ALGORITMO = "HMAC-SHA256-V1";

    private final byte[] clave;

    public FirmaElectronicaInternaServicioImpl(@Value("${descanso-medico.firma.clave}") String clave) {
        if (clave == null || clave.length() < 32) {
            throw new IllegalStateException(
                    "descanso-medico.firma.clave debe tener al menos 32 caracteres y no debe versionarse en el repositorio");
        }
        this.clave = clave.getBytes(StandardCharsets.UTF_8);
    }

    @Override
    public FirmaElectronica firmar(DatosFirma datos) {
        byte[] canonico = canonico(datos).getBytes(StandardCharsets.UTF_8);
        return new FirmaElectronica(TIPO, ALGORITMO, hex(hmac(canonico)), hex(sha256(canonico)));
    }

    @Override
    public boolean verificar(DatosFirma datos, String firma) {
        if (firma == null) {
            return false;
        }
        byte[] esperada = hex(hmac(canonico(datos).getBytes(StandardCharsets.UTF_8))).getBytes(StandardCharsets.UTF_8);
        return MessageDigest.isEqual(esperada, firma.getBytes(StandardCharsets.UTF_8));
    }

    private String canonico(DatosFirma d) {
        return String.join("\n",
                "V1",
                d.codigoDocumento(),
                d.numero(),
                String.valueOf(d.idCita()),
                String.valueOf(d.idPaciente()),
                d.pacienteDocumento(),
                String.valueOf(d.idMedico()),
                d.medicoNombre(),
                d.medicoColegiatura() == null ? "" : d.medicoColegiatura(),
                d.medicoEspecialidad(),
                d.fechaAtencion().toString(),
                d.fechaInicio().toString(),
                d.fechaFin().toString(),
                String.valueOf(d.dias()),
                hex(sha256(d.justificacion().getBytes(StandardCharsets.UTF_8))),
                d.fechaEmision().toString(),
                d.metodoConfirmacion());
    }

    private byte[] hmac(byte[] datos) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(clave, "HmacSHA256"));
            return mac.doFinal(datos);
        } catch (GeneralSecurityException e) {
            throw new IllegalStateException("No se pudo calcular la firma electrónica", e);
        }
    }

    private byte[] sha256(byte[] datos) {
        try {
            return MessageDigest.getInstance("SHA-256").digest(datos);
        } catch (GeneralSecurityException e) {
            throw new IllegalStateException("No se pudo calcular el hash del documento", e);
        }
    }

    private String hex(byte[] bytes) {
        return HexFormat.of().formatHex(bytes);
    }
}