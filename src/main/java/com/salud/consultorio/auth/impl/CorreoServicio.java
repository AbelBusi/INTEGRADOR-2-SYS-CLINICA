package com.salud.consultorio.auth.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CorreoServicio {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String remitente;

    public void enviarCodigoRecuperacion(String destino, String codigo, int minutos) {
        SimpleMailMessage mensaje = new SimpleMailMessage();
        mensaje.setFrom(remitente);
        mensaje.setTo(destino);
        mensaje.setSubject("Recuperación de contraseña - Consultorio");
        mensaje.setText("""
                Tu código de recuperación es: %s

                Expira en %d minutos. Si no lo solicitaste, ignora este mensaje.
                """.formatted(codigo, minutos));
        mailSender.send(mensaje);
    }
}