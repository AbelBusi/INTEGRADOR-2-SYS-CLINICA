package com.salud.consultorio.auth.impl;

import com.salud.consultorio.auth.dto.registro.*;
import com.salud.consultorio.auth.exception.CodigoRegistroInvalidoException;
import com.salud.consultorio.auth.service.IAuthServicio;
import com.salud.consultorio.auth.service.IAutorregistroPacienteServicio;
import com.salud.consultorio.dto.usuario.UsuarioCreadoDTO;
import com.salud.consultorio.model.entity.CodigoAutorregistro;
import com.salud.consultorio.model.entity.Persona;
import com.salud.consultorio.model.entity.Rol;
import com.salud.consultorio.model.entity.Usuario;
import com.salud.consultorio.repository.ICodigoAutorregistroRepositorio;
import com.salud.consultorio.repository.IPersonaRepositorio;
import com.salud.consultorio.repository.IRolRepositorio;
import com.salud.consultorio.repository.IUsuarioRepositorio;
import com.salud.consultorio.repository.IUsuarioRolRepositorio;
import com.salud.consultorio.service.IUsuarioRolServicio;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.text.Normalizer;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Locale;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class AutorregistroPacienteServicioImpl implements IAutorregistroPacienteServicio {

    private static final String ROL_PACIENTE = "PACIENTE";
    private static final int EXPIRACION_MINUTOS = 10;
    private static final int MAX_INTENTOS = 5;
    private static final int MAX_SOLICITUDES_POR_HORA = 5;

    private static final String MSG_NO_ELEGIBLE =
            "El autorregistro es exclusivo para pacientes registrados en el establecimiento. "
                    + "Acude a recepción para registrarte o actualizar tus datos.";
    private static final String MSG_CUENTA_EXISTENTE =
            "Ya existe una cuenta de paciente asociada a tu documento. Inicia sesión con tus credenciales.";
    private static final String MSG_AGREGAR_ROL =
            "Ya existe una cuenta asociada a tu documento. Para habilitar tu acceso como paciente con las "
                    + "mismas credenciales, primero verificaremos tu identidad y tu correo registrado.";
    private static final String MSG_PUEDE_CREAR =
            "Documento validado. Confirma tus datos personales para continuar.";
    private static final String MSG_DATOS_VALIDADOS =
            "Datos validados. Continúa para verificar tu correo electrónico.";
    private static final String MSG_DATOS_INCORRECTOS =
            "Los datos ingresados no coinciden con los registrados. Verifica la información "
                    + "o acude a recepción para actualizarla.";
    private static final String MSG_BLOQUEADO =
            "Superaste el número de intentos permitidos. Inténtalo nuevamente en 30 minutos "
                    + "o acude a recepción.";
    private static final String MSG_CODIGO_INVALIDO = "Código inválido o expirado";

    private final IPersonaRepositorio personaRepositorio;
    private final IUsuarioRepositorio usuarioRepositorio;
    private final IUsuarioRolRepositorio usuarioRolRepositorio;
    private final IRolRepositorio rolRepositorio;
    private final ICodigoAutorregistroRepositorio codigoRepositorio;
    private final IUsuarioRolServicio usuarioRolServicio;
    private final IAuthServicio authServicio;
    private final CorreoServicio correoServicio;
    private final RegistroIntentoServicio intentoServicio;
    private final PasswordEncoder passwordEncoder;

    private final SecureRandom random = new SecureRandom();

    private record Contexto(EstadoRegistro estado, Persona persona, Usuario usuario) {}

    @Transactional(readOnly = true)
    @Override
    public ElegibilidadResponse consultarElegibilidad(ElegibilidadRegistroRequest dto) {

        Contexto ctx = evaluar(dto.tipoDocumento(), dto.numeroDocumento());

        return switch (ctx.estado()) {
            case NO_ELEGIBLE -> new ElegibilidadResponse(
                    EstadoRegistro.NO_ELEGIBLE, MSG_NO_ELEGIBLE, false, null);
            case CUENTA_EXISTENTE -> new ElegibilidadResponse(
                    EstadoRegistro.CUENTA_EXISTENTE, MSG_CUENTA_EXISTENTE, false, null);
            case PUEDE_AGREGAR_ROL -> new ElegibilidadResponse(
                    EstadoRegistro.PUEDE_AGREGAR_ROL, MSG_AGREGAR_ROL, false, null);
            case PUEDE_CREAR_CUENTA -> new ElegibilidadResponse(
                    EstadoRegistro.PUEDE_CREAR_CUENTA, MSG_PUEDE_CREAR, false, null);
        };
    }

    @Transactional
    @Override
    public ElegibilidadResponse verificarIdentidad(VerificarIdentidadRequest dto) {

        Contexto ctx = exigirElegible(evaluar(dto.tipoDocumento(), dto.numeroDocumento()));
        Persona persona = ctx.persona();

        validarIdentidad(persona, dto.nombres(), dto.apellidos(), dto.fechaNacimiento());

        boolean tieneCorreo = !normalizarCorreo(persona.getCorreo()).isEmpty();

        return new ElegibilidadResponse(
                ctx.estado(),
                ctx.estado() == EstadoRegistro.PUEDE_AGREGAR_ROL ? MSG_AGREGAR_ROL : MSG_DATOS_VALIDADOS,
                tieneCorreo,
                tieneCorreo ? enmascarar(persona.getCorreo()) : null);
    }

    @Transactional
    @Override
    public CodigoEnviadoResponse enviarCodigo(EnviarCodigoRegistroRequest dto) {

        Contexto ctx = exigirElegible(evaluar(dto.tipoDocumento(), dto.numeroDocumento()));
        Persona persona = ctx.persona();

        validarIdentidad(persona, dto.nombres(), dto.apellidos(), dto.fechaNacimiento());

        String registrado = normalizarCorreo(persona.getCorreo());
        String destino;

        if (registrado.isEmpty()) {
            String nuevo = normalizarCorreo(dto.correoNuevo());

            if (nuevo.isEmpty()) {
                throw new IllegalArgumentException("Ingresa un correo electrónico para continuar");
            }

            if (personaRepositorio.existsByCorreoIgnoreCaseAndIdNot(nuevo, persona.getId())) {
                throw new IllegalArgumentException("Este correo no está disponible. Ingresa otro correo");
            }

            destino = nuevo;
        } else {
            destino = registrado;
        }

        long solicitudes = codigoRepositorio.countByPersonaIdAndFechaCreacionAfter(
                persona.getId(), LocalDateTime.now().minusHours(1));

        if (solicitudes >= MAX_SOLICITUDES_POR_HORA) {
            throw new IllegalArgumentException(
                    "Alcanzaste el límite de códigos solicitados. Inténtalo nuevamente más tarde");
        }

        codigoRepositorio.invalidarActivos(persona.getId());

        String codigo = String.format("%06d", random.nextInt(1_000_000));

        codigoRepositorio.save(CodigoAutorregistro.builder()
                .persona(persona)
                .correoDestino(destino)
                .codigoHash(passwordEncoder.encode(codigo))
                .fechaExpiracion(LocalDateTime.now().plusMinutes(EXPIRACION_MINUTOS))
                .build());

        correoServicio.enviarCodigoVerificacionRegistro(destino, codigo, EXPIRACION_MINUTOS);

        String enmascarado = enmascarar(destino);

        return new CodigoEnviadoResponse(
                "Enviamos un código de verificación a " + enmascarado
                        + ". Vence en " + EXPIRACION_MINUTOS + " minutos.",
                enmascarado);
    }

    @Transactional(noRollbackFor = CodigoRegistroInvalidoException.class)
    @Override
    public RegistroCompletadoResponse completar(CompletarRegistroRequest dto) {

        Contexto ctx = exigirElegible(evaluar(dto.tipoDocumento(), dto.numeroDocumento()));
        Persona persona = ctx.persona();

        validarIdentidad(persona, dto.nombres(), dto.apellidos(), dto.fechaNacimiento());

        CodigoAutorregistro registro = validarCodigo(persona, dto.codigo());

        if (ctx.estado() == EstadoRegistro.PUEDE_AGREGAR_ROL) {

            usuarioRolServicio.asignarRol(ctx.usuario().getId(), rolPaciente().getId());

            registro.setUsado(true);
            codigoRepositorio.save(registro);

            return new RegistroCompletadoResponse(
                    false,
                    "Listo. Tu perfil de paciente quedó habilitado en tu cuenta existente. "
                            + "Inicia sesión con tus mismas credenciales y selecciona el perfil PACIENTE.",
                    enmascarar(persona.getCorreo()));
        }

        if (normalizarCorreo(persona.getCorreo()).isEmpty()) {

            if (personaRepositorio.existsByCorreoIgnoreCaseAndIdNot(registro.getCorreoDestino(), persona.getId())) {
                throw new IllegalArgumentException(
                        "Este correo ya no está disponible. Reinicia el registro con otro correo");
            }

            persona.setCorreo(registro.getCorreoDestino());
            personaRepositorio.saveAndFlush(persona);
        }

        registro.setUsado(true);
        codigoRepositorio.save(registro);

        UsuarioCreadoDTO creado = authServicio.crearUsuarioPortal(persona.getId());

        return new RegistroCompletadoResponse(
                true,
                "Tu cuenta fue creada. Enviamos tu usuario y contraseña temporal a "
                        + creado.correoEnmascarado()
                        + ". Deberás cambiar la contraseña al iniciar sesión.",
                creado.correoEnmascarado());
    }

    private Contexto evaluar(String tipoDocumento, String numeroDocumento) {

        Persona persona = personaRepositorio
                .findByTipoDocumento_CodigoIgnoreCaseAndNumeroDocumento(
                        tipoDocumento.trim(), numeroDocumento.trim())
                .orElse(null);

        // Casos A y B: no existe, o existe sin registro activo de Paciente (incluye empleados).
        if (persona == null
                || !Integer.valueOf(1).equals(persona.getEstado())
                || !usuarioRolRepositorio.personaEsPacienteActivo(persona.getId())) {
            return new Contexto(EstadoRegistro.NO_ELEGIBLE, null, null);
        }

        Usuario usuario = usuarioRepositorio.findByPersona_Id(persona.getId()).orElse(null);

        // Caso C
        if (usuario == null) {
            return new Contexto(EstadoRegistro.PUEDE_CREAR_CUENTA, persona, null);
        }

        if (!Integer.valueOf(1).equals(usuario.getEstado())) {
            return new Contexto(EstadoRegistro.NO_ELEGIBLE, null, null);
        }

        // Caso D
        if (usuarioRepositorio.tieneRolActivo(usuario.getId(), ROL_PACIENTE)) {
            return new Contexto(EstadoRegistro.CUENTA_EXISTENTE, persona, usuario);
        }

        // Cuenta existente sin PACIENTE: solo se verifica con el correo ya registrado.
        if (normalizarCorreo(persona.getCorreo()).isEmpty()) {
            return new Contexto(EstadoRegistro.NO_ELEGIBLE, null, null);
        }

        return new Contexto(EstadoRegistro.PUEDE_AGREGAR_ROL, persona, usuario);
    }

    private Contexto exigirElegible(Contexto ctx) {
        if (ctx.estado() == EstadoRegistro.NO_ELEGIBLE) {
            throw new IllegalArgumentException(MSG_NO_ELEGIBLE);
        }
        if (ctx.estado() == EstadoRegistro.CUENTA_EXISTENTE) {
            throw new IllegalArgumentException(MSG_CUENTA_EXISTENTE);
        }
        return ctx;
    }

    private void validarIdentidad(Persona persona, String nombres, String apellidos, LocalDate fechaNacimiento) {

        if (intentoServicio.bloqueado(persona.getId())) {
            throw new IllegalArgumentException(MSG_BLOQUEADO);
        }

        boolean coincide = fechaNacimiento != null
                && fechaNacimiento.equals(persona.getFechaNacimiento())
                && normalizarTexto(nombres).equals(normalizarTexto(persona.getNombre()))
                && normalizarTexto(apellidos).equals(normalizarTexto(persona.getApellidos()));

        if (!coincide) {
            intentoServicio.registrarFallo(persona.getId());
            throw new IllegalArgumentException(MSG_DATOS_INCORRECTOS);
        }
    }

    private CodigoAutorregistro validarCodigo(Persona persona, String codigo) {

        CodigoAutorregistro registro = codigoRepositorio
                .findFirstByPersonaIdAndUsadoFalseOrderByFechaCreacionDesc(persona.getId())
                .orElseThrow(() -> new CodigoRegistroInvalidoException(MSG_CODIGO_INVALIDO));

        String registrado = normalizarCorreo(persona.getCorreo());
        boolean destinoVigente = registrado.isEmpty()
                || registrado.equals(normalizarCorreo(registro.getCorreoDestino()));

        if (registro.getFechaExpiracion().isBefore(LocalDateTime.now())
                || registro.getIntentos() >= MAX_INTENTOS
                || !destinoVigente) {
            registro.setUsado(true);
            codigoRepositorio.save(registro);
            throw new CodigoRegistroInvalidoException(MSG_CODIGO_INVALIDO);
        }

        if (!passwordEncoder.matches(codigo, registro.getCodigoHash())) {
            registro.setIntentos(registro.getIntentos() + 1);
            codigoRepositorio.save(registro);
            throw new CodigoRegistroInvalidoException(MSG_CODIGO_INVALIDO);
        }

        return registro;
    }

    private Rol rolPaciente() {
        return rolRepositorio.findByNombreIgnoreCase(ROL_PACIENTE)
                .filter(rol -> Integer.valueOf(1).equals(rol.getEstado()))
                .orElseThrow(() -> new EntityNotFoundException("El rol PACIENTE no existe o no está activo"));
    }

    private String normalizarCorreo(String correo) {
        return correo == null ? "" : correo.trim().toLowerCase(Locale.ROOT);
    }

    private String normalizarTexto(String texto) {
        return Normalizer.normalize(Objects.toString(texto, ""), Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9]+", " ")
                .trim();
    }

    private String enmascarar(String correo) {

        String valor = correo == null ? "" : correo.trim();
        int arroba = valor.indexOf('@');

        if (arroba <= 0) {
            return "***";
        }

        String local = valor.substring(0, arroba);
        String visible = local.substring(0, Math.min(2, local.length()));

        return visible + "***" + valor.substring(arroba);
    }
}