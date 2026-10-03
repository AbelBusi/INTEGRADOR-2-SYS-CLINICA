package com.salud.consultorio.auth.impl;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.MailPreparationException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class CorreoServicio {

    private static final ZoneId LIMA = ZoneId.of("America/Lima");
    private static final DateTimeFormatter HORA =
            DateTimeFormatter.ofPattern("hh:mm a", new Locale("es", "PE"));

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Value("${spring.mail.username}")
    private String remitente;

    @Value("${app.frontend.recuperacion-url:}")
    private String urlRecuperacion;

    public void enviarCodigoRecuperacion(String destino, String codigo, int minutos) {
        try {
            ClassPathResource escudo   = new ClassPathResource("email/escudo-peru.png");
            ClassPathResource logoMins = new ClassPathResource("email/logo-minsa.png");
            ClassPathResource hospital = new ClassPathResource("email/hospital-jose-olaya.png");

            Context ctx = new Context(new Locale("es", "PE"));
            ctx.setVariable("codigo", codigo);
            ctx.setVariable("urlRecuperacion", urlRecuperacion);            ctx.setVariable("minutos", minutos);
            ctx.setVariable("horaLimite",
                    LocalDateTime.now(LIMA).plusMinutes(minutos).format(HORA).toLowerCase());
            ctx.setVariable("tieneEscudo", escudo.exists());
            ctx.setVariable("tieneLogoMinsa", logoMins.exists());
            ctx.setVariable("tieneHospital", hospital.exists());

            String html = templateEngine.process("email/codigo-recuperacion", ctx);

            MimeMessage mime = mailSender.createMimeMessage();
            MimeMessageHelper helper =
                    new MimeMessageHelper(mime, true, StandardCharsets.UTF_8.name());

            helper.setFrom(remitente, "MINSA - Hospital José Olaya");
            helper.setTo(destino);
            helper.setSubject("Código de recuperación de contraseña - Hospital José Olaya");
            helper.setText("Tu código de recuperación es: " + codigo
                    + ". Expira en " + minutos + " minutos.", html);   // texto plano + HTML

            if (escudo.exists())   helper.addInline("escudo", escudo, "image/png");
            if (logoMins.exists()) helper.addInline("logoMinsa", logoMins, "image/png");
            if (hospital.exists()) helper.addInline("hospital", hospital, "image/png");

            mailSender.send(mime);

        } catch (Exception e) {
            throw new MailPreparationException("No se pudo construir el correo", e);
        }
    }
}