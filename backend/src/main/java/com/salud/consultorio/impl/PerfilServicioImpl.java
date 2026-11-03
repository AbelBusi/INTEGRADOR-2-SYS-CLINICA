package com.salud.consultorio.impl;

import com.salud.consultorio.auth.exception.UsuarioInactivoException;
import com.salud.consultorio.auth.impl.PerfilCorreoServicio;
import com.salud.consultorio.auth.service.IAuthServicio;
import com.salud.consultorio.dto.perfil.ActualizarContactoRequest;
import com.salud.consultorio.dto.perfil.CambiarClavePerfilRequest;
import com.salud.consultorio.dto.perfil.PerfilDTO;
import com.salud.consultorio.dto.perfil.PerfilDTO.DatoPerfilDTO;
import com.salud.consultorio.dto.perfil.PerfilDTO.RolPerfilDTO;
import com.salud.consultorio.model.entity.CodigoVerificacionCorreo;
import com.salud.consultorio.model.entity.Persona;
import com.salud.consultorio.model.entity.Rol;
import com.salud.consultorio.model.entity.Usuario;
import com.salud.consultorio.model.entity.UsuarioRol;
import com.salud.consultorio.repository.ICodigoVerificacionCorreoRepositorio;
import com.salud.consultorio.repository.IEmpleadoRepositorio;
import com.salud.consultorio.repository.IMedicoRepositorio;
import com.salud.consultorio.repository.IPacienteRepositorio;
import com.salud.consultorio.repository.IPersonaRepositorio;
import com.salud.consultorio.repository.IUsuarioRepositorio;
import com.salud.consultorio.repository.IUsuarioRolRepositorio;
import com.salud.consultorio.service.IPerfilServicio;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class PerfilServicioImpl implements IPerfilServicio {

    private static final int EXPIRACION_MINUTOS = 10;
    private static final int MAX_INTENTOS = 5;
    private static final int ESPERA_SEGUNDOS = 60;
    private static final String MSG_CODIGO_INVALIDO = "Código inválido o expirado";
    private static final String MSG_INACTIVO =
            "Tu cuenta está desactivada. Comunícate con el administrador del sistema.";
    private static final DateTimeFormatter FECHA = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    private final IUsuarioRepositorio usuarioRepositorio;
    private final IPersonaRepositorio personaRepositorio;
    private final IUsuarioRolRepositorio usuarioRolRepositorio;
    private final IEmpleadoRepositorio empleadoRepositorio;
    private final IMedicoRepositorio medicoRepositorio;
    private final IPacienteRepositorio pacienteRepositorio;
    private final ICodigoVerificacionCorreoRepositorio codigoRepositorio;
    private final PasswordEncoder passwordEncoder;
    private final PerfilCorreoServicio perfilCorreoServicio;
    private final IAuthServicio authServicio;

    private final SecureRandom random = new SecureRandom();

    @Transactional(readOnly = true)
    @Override
    public PerfilDTO obtener(String nombreUsuario) {
        return aPerfil(usuarioActivo(nombreUsuario));
    }

    @Transactional
    @Override
    public PerfilDTO actualizarContacto(String nombreUsuario, ActualizarContactoRequest dto) {

        Usuario usuario = usuarioActivo(nombreUsuario);
        Persona persona = usuario.getPersona();

        String telefono = dto.telefono().trim();

        if (personaRepositorio.existsByTelefonoAndIdNot(telefono, persona.getId())) {
            throw new DataIntegrityViolationException("El teléfono ya está registrado en otra persona");
        }

        persona.setTelefono(telefono);
        persona.setDireccion(dto.direccion().trim());
        personaRepositorio.save(persona);

        return aPerfil(usuario);
    }

    @Transactional
    @Override
    public String solicitarCambioCorreo(String nombreUsuario, String nuevoCorreo) {

        Usuario usuario = usuarioActivo(nombreUsuario);
        Persona persona = usuario.getPersona();

        String correo = nuevoCorreo.trim().toLowerCase(Locale.ROOT);

        if (persona.getCorreo() != null && correo.equalsIgnoreCase(persona.getCorreo().trim())) {
            throw new IllegalArgumentException("El nuevo correo debe ser distinto al actual");
        }

        if (personaRepositorio.existsByCorreoIgnoreCaseAndIdNot(correo, persona.getId())) {
            throw new DataIntegrityViolationException("El correo ya está registrado en otra persona");
        }

        codigoRepositorio
                .findFirstByUsuarioIdAndUsadoFalseOrderByFechaCreacionDesc(usuario.getId())
                .filter(c -> c.getFechaCreacion().isAfter(LocalDateTime.now().minusSeconds(ESPERA_SEGUNDOS)))
                .ifPresent(c -> {
                    throw new IllegalArgumentException(
                            "Espera un minuto antes de solicitar un nuevo código");
                });

        codigoRepositorio.invalidarActivos(usuario.getId());

        String codigo = String.format("%06d", random.nextInt(1_000_000));

        codigoRepositorio.save(CodigoVerificacionCorreo.builder()
                .usuario(usuario)
                .correoNuevo(correo)
                .codigoHash(passwordEncoder.encode(codigo))
                .fechaExpiracion(LocalDateTime.now().plusMinutes(EXPIRACION_MINUTOS))
                .build());

        perfilCorreoServicio.enviarCodigoCambioCorreo(correo, codigo, EXPIRACION_MINUTOS);

        return enmascarar(correo);
    }

    @Transactional(noRollbackFor = IllegalArgumentException.class)
    @Override
    public PerfilDTO confirmarCambioCorreo(String nombreUsuario, String codigo) {

        Usuario usuario = usuarioActivo(nombreUsuario);

        CodigoVerificacionCorreo registro = codigoRepositorio
                .findFirstByUsuarioIdAndUsadoFalseOrderByFechaCreacionDesc(usuario.getId())
                .orElseThrow(() -> new IllegalArgumentException(MSG_CODIGO_INVALIDO));

        if (registro.getFechaExpiracion().isBefore(LocalDateTime.now())
                || registro.getIntentos() >= MAX_INTENTOS) {
            registro.setUsado(true);
            codigoRepositorio.save(registro);
            throw new IllegalArgumentException(MSG_CODIGO_INVALIDO);
        }

        if (!passwordEncoder.matches(codigo, registro.getCodigoHash())) {
            registro.setIntentos(registro.getIntentos() + 1);
            codigoRepositorio.save(registro);
            throw new IllegalArgumentException(MSG_CODIGO_INVALIDO);
        }

        Persona persona = usuario.getPersona();

        if (personaRepositorio.existsByCorreoIgnoreCaseAndIdNot(registro.getCorreoNuevo(), persona.getId())) {
            registro.setUsado(true);
            codigoRepositorio.save(registro);
            throw new IllegalArgumentException("El correo ya está registrado en otra persona");
        }

        persona.setCorreo(registro.getCorreoNuevo());
        personaRepositorio.save(persona);

        registro.setUsado(true);
        codigoRepositorio.save(registro);

        return aPerfil(usuario);
    }

    @Transactional
    @Override
    public void cambiarClave(String nombreUsuario, CambiarClavePerfilRequest dto) {

        Usuario usuario = usuarioActivo(nombreUsuario);

        if (!passwordEncoder.matches(dto.claveActual(), usuario.getClaveAcceso())) {
            throw new IllegalArgumentException("La contraseña actual es incorrecta");
        }

        if (!dto.nuevaClave().equals(dto.confirmacionClave())) {
            throw new IllegalArgumentException("La confirmación no coincide con la nueva contraseña");
        }

        if (passwordEncoder.matches(dto.nuevaClave(), usuario.getClaveAcceso())) {
            throw new IllegalArgumentException("La nueva contraseña debe ser distinta a la actual");
        }

        usuario.setClaveAcceso(passwordEncoder.encode(dto.nuevaClave()));
        usuario.setRequiereCambioClave(false);
        usuarioRepositorio.save(usuario);

        authServicio.revocarSesionesUsuario(usuario.getId());
    }

    private Usuario usuarioActivo(String nombreUsuario) {

        Usuario usuario = usuarioRepositorio.findByUsuario(nombreUsuario)
                .orElseThrow(() -> new UsernameNotFoundException("No existe el usuario"));

        if (!Integer.valueOf(1).equals(usuario.getEstado())) {
            throw new UsuarioInactivoException(MSG_INACTIVO);
        }

        return usuario;
    }

    private PerfilDTO aPerfil(Usuario usuario) {

        Persona persona = usuario.getPersona();

        List<RolPerfilDTO> roles = usuarioRolRepositorio
                .findAllByUsuario_UsuarioAndEstadoAndRol_Estado(usuario.getUsuario(), 1, 1)
                .stream()
                .map(UsuarioRol::getRol)
                .sorted(Comparator.comparing(Rol::getId))
                .map(rol -> new RolPerfilDTO(rol.getId(), rol.getNombre(), rol.getDescripcion()))
                .toList();

        return new PerfilDTO(
                persona.getNombre(),
                persona.getApellidos(),
                persona.getTipoDocumento() != null ? persona.getTipoDocumento().getDescripcion() : null,
                persona.getNumeroDocumento(),
                persona.getFechaNacimiento(),
                persona.getGenero(),
                persona.getNacionalidad(),
                persona.getTelefono(),
                persona.getCorreo(),
                persona.getDireccion(),
                usuario.getUsuario(),
                usuario.getEstado(),
                roles,
                datosAdicionales(persona)
        );
    }

    private List<DatoPerfilDTO> datosAdicionales(Persona persona) {

        List<DatoPerfilDTO> datos = new ArrayList<>();

        empleadoRepositorio.findByPersonaId(persona.getId()).ifPresent(empleado -> {

            if (empleado.getCargo() != null) {
                datos.add(new DatoPerfilDTO("Cargo", empleado.getCargo().getNombre()));
            }

            if (empleado.getFechaIngreso() != null) {
                datos.add(new DatoPerfilDTO("Fecha de ingreso", empleado.getFechaIngreso().format(FECHA)));
            }

            medicoRepositorio.findByEmpleadoId(empleado.getId()).ifPresent(medico -> {

                if (medico.getEspecialidad() != null) {
                    datos.add(new DatoPerfilDTO("Especialidad", medico.getEspecialidad().getNombre()));
                }

                datos.add(new DatoPerfilDTO("N.° de colegiatura", medico.getNumeroColegiatura()));

                if (tieneTexto(medico.getNumeroEspecialidad())) {
                    datos.add(new DatoPerfilDTO("N.° de especialidad", medico.getNumeroEspecialidad()));
                }

                if (tieneTexto(medico.getConsejoRegional())) {
                    datos.add(new DatoPerfilDTO("Consejo regional", medico.getConsejoRegional()));
                }
            });
        });

        pacienteRepositorio.findByPersonaId(persona.getId()).ifPresent(paciente -> {
            datos.add(new DatoPerfilDTO("Entidad aseguradora", paciente.getEntidadAsegurado()));
            datos.add(new DatoPerfilDTO("Código de asegurado", paciente.getCodigoAsegurado()));
        });

        return datos;
    }

    private boolean tieneTexto(String valor) {
        return valor != null && !valor.isBlank();
    }

    private String enmascarar(String correo) {
        int arroba = correo.indexOf('@');
        return arroba <= 1 ? "***" : correo.charAt(0) + "***" + correo.substring(arroba);
    }
}