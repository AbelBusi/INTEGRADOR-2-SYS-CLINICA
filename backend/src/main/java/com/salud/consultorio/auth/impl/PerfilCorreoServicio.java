package com.salud.consultorio.auth.impl;

import com.salud.consultorio.auth.exception.CorreoEnvioException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
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

@Slf4j
@Service
@RequiredArgsConstructor
public class PerfilCorreoServicio {

    private static final ZoneId LIMA = ZoneId.of("America/Lima");
    private static final DateTimeFormatter HORA =
            DateTimeFormatter.ofPattern("hh:mm a", new Locale("es", "PE"));

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Value("${spring.mail.username}")
    private String remitente;

    public void enviarCodigoCambioCorreo(String destino, String codigo, int minutos) {
        try {
            ClassPathResource logoMinsa = new ClassPathResource("email/logo-minsa.png");
            ClassPathResource hospital = new ClassPathResource("email/hospital-jose-olaya.png");

            Context ctx = new Context(new Locale("es", "PE"));
            ctx.setVariable("codigo", codigo);
            ctx.setVariable("minutos", minutos);
            ctx.setVariable("horaLimite",
                    LocalDateTime.now(LIMA).plusMinutes(minutos).format(HORA).toLowerCase());
            ctx.setVariable("tieneLogoMinsa", logoMinsa.exists());
            ctx.setVariable("tieneHospital", hospital.exists());

            String html = templateEngine.process("email/codigo-verificacion-correo", ctx);

            MimeMessage mime = mailSender.createMimeMessage();
            MimeMessageHelper helper =
                    new MimeMessageHelper(mime, true, StandardCharsets.UTF_8.name());

            helper.setFrom(remitente, "MINSA - Hospital José Olaya");
            helper.setTo(destino);
            helper.setSubject("Verifica tu nuevo correo - Hospital José Olaya");
            helper.setText("Tu código para verificar el nuevo correo es: " + codigo
                    + ". Expira en " + minutos + " minutos.", html);

            if (logoMinsa.exists()) helper.addInline("logoMinsa", logoMinsa, "image/png");
            if (hospital.exists()) helper.addInline("hospital", hospital, "image/png");

            mailSender.send(mime);

        } catch (Exception e) {
            log.error("Falló el envío del código de verificación de correo", e);
            throw new CorreoEnvioException(
                    "No se pudo enviar el código al correo indicado. Verifica que esté bien escrito e inténtalo de nuevo.",
                    e
            );
        }
    }
}