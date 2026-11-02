package com.salud.consultorio.auth.impl;

import com.salud.consultorio.auth.dto.CanalRecuperacion;
import com.salud.consultorio.auth.exception.SmsEnvioException;
import com.salud.consultorio.auth.service.IRecuperacionClaveServicio;
import com.salud.consultorio.model.entity.CodigoRecuperacion;
import com.salud.consultorio.model.entity.Persona;
import com.salud.consultorio.model.entity.Token;
import com.salud.consultorio.model.entity.Usuario;
import com.salud.consultorio.repository.ICodigoRecuperacionRepositorio;
import com.salud.consultorio.repository.ITokenRepositorio;
import com.salud.consultorio.repository.IUsuarioRepositorio;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.MailException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class RecuperacionClaveServicioImpl implements IRecuperacionClaveServicio {

    private static final int EXPIRACION_MINUTOS = 10;
    private static final int MAX_INTENTOS = 5;
    private static final String MSG_INVALIDO = "Código inválido o expirado";

    private final IUsuarioRepositorio usuarioRepositorio;
    private final ICodigoRecuperacionRepositorio codigoRepositorio;
    private final ITokenRepositorio tokenRepositorio;
    private final PasswordEncoder passwordEncoder;
    private final CorreoServicio correoServicio;
    private final SmsServicio smsServicio;

    private final SecureRandom random = new SecureRandom();

    @Transactional
    @Override
    public void solicitarCodigo(String nombreUsuario,
                                String numeroDocumento,
                                CanalRecuperacion canal,
                                String destino) {

        Optional<Usuario> opt = usuarioRepositorio.findByUsuario(nombreUsuario);
        if (opt.isEmpty()) return;

        Usuario usuario = opt.get();
        if (usuario.getEstado() != 1) return;

        Persona persona = usuario.getPersona();

        if (!coincideDocumento(numeroDocumento, persona.getNumeroDocumento())) {
            log.warn("Recuperación rechazada: documento no coincide (usuarioId={})", usuario.getId());
            return;
        }

        String registrado = canal == CanalRecuperacion.CORREO
                ? persona.getCorreo()
                : persona.getTelefono();

        if (registrado == null || registrado.isBlank()) return;

        boolean coincide = canal == CanalRecuperacion.CORREO
                ? normalizarCorreo(destino).equals(normalizarCorreo(registrado))
                : normalizarTelefono(destino).equals(normalizarTelefono(registrado));

        if (!coincide) {
            log.warn("Recuperación rechazada: {} no coincide (usuarioId={})", canal, usuario.getId());
            return;
        }

        codigoRepositorio.invalidarActivos(usuario.getId());

        String codigo = String.format("%06d", random.nextInt(1_000_000));

        codigoRepositorio.save(CodigoRecuperacion.builder()
                .usuario(usuario)
                .codigoHash(passwordEncoder.encode(codigo))
                .fechaExpiracion(LocalDateTime.now().plusMinutes(EXPIRACION_MINUTOS))
                .build());

        try {
            if (canal == CanalRecuperacion.CORREO) {
                correoServicio.enviarCodigoRecuperacion(registrado.trim(), codigo, EXPIRACION_MINUTOS);
            } else {
                smsServicio.enviarCodigoRecuperacion(registrado, codigo, EXPIRACION_MINUTOS);
            }
        } catch (MailException | SmsEnvioException e) {
            log.error("No se pudo enviar el código de recuperación por {}", canal, e);
        }
    }

    @Transactional(noRollbackFor = IllegalArgumentException.class)
    @Override
    public void verificarCodigo(String nombreUsuario, String codigo) {
        validar(nombreUsuario, codigo);
    }

    @Transactional(noRollbackFor = IllegalArgumentException.class)
    @Override
    public void restablecerClave(String nombreUsuario, String codigo, String nuevaClave) {
        CodigoRecuperacion registro = validar(nombreUsuario, codigo);
        Usuario usuario = registro.getUsuario();

        usuario.setClaveAcceso(passwordEncoder.encode(nuevaClave));
        usuario.setRequiereCambioClave(false);
        usuarioRepositorio.save(usuario);

        registro.setUsado(true);
        codigoRepositorio.save(registro);

        revocarTokens(usuario);
    }

    private CodigoRecuperacion validar(String nombreUsuario, String codigo) {
        Usuario usuario = usuarioRepositorio.findByUsuario(nombreUsuario)
                .orElseThrow(() -> new IllegalArgumentException(MSG_INVALIDO));

        CodigoRecuperacion registro = codigoRepositorio
                .findFirstByUsuarioIdAndUsadoFalseOrderByFechaCreacionDesc(usuario.getId())
                .orElseThrow(() -> new IllegalArgumentException(MSG_INVALIDO));

        if (registro.getFechaExpiracion().isBefore(LocalDateTime.now())
                || registro.getIntentos() >= MAX_INTENTOS) {
            registro.setUsado(true);
            codigoRepositorio.save(registro);
            throw new IllegalArgumentException(MSG_INVALIDO);
        }

        if (!passwordEncoder.matches(codigo, registro.getCodigoHash())) {
            registro.setIntentos(registro.getIntentos() + 1);
            codigoRepositorio.save(registro);
            throw new IllegalArgumentException(MSG_INVALIDO);
        }

        return registro;
    }

    private void revocarTokens(Usuario usuario) {
        List<Token> tokens = tokenRepositorio
                .findAllByUsuarioIdAndExpiredFalseAndRevokedFalse(usuario.getId());
        tokens.forEach(t -> { t.setExpired(true); t.setRevoked(true); });
        tokenRepositorio.saveAll(tokens);
    }

    private boolean coincideDocumento(String ingresado, String registrado) {
        return ingresado != null && registrado != null
                && ingresado.trim().equalsIgnoreCase(registrado.trim());
    }

    private String normalizarCorreo(String correo) {
        return correo == null ? "" : correo.trim().toLowerCase();
    }

    private String normalizarTelefono(String telefono) {
        if (telefono == null) return "";
        String digitos = telefono.replaceAll("\\D", "");
        if (digitos.length() == 11 && digitos.startsWith("51")) {
            digitos = digitos.substring(2);
        }
        return digitos;
    }
}