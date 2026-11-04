package com.salud.consultorio.impl;

import com.salud.consultorio.dto.usuario.PersonaUsuarioDTO;
import com.salud.consultorio.dto.usuario.RolOpcionDTO;
import com.salud.consultorio.dto.usuario.RolesAsignablesDTO;
import com.salud.consultorio.model.entity.Cargo;
import com.salud.consultorio.model.entity.Empleado;
import com.salud.consultorio.model.entity.Persona;
import com.salud.consultorio.model.entity.Rol;
import com.salud.consultorio.repository.IEmpleadoRepositorio;
import com.salud.consultorio.repository.IPersonaRepositorio;
import com.salud.consultorio.repository.IRolRepositorio;
import com.salud.consultorio.repository.IUsuarioRepositorio;
import com.salud.consultorio.repository.IUsuarioRolRepositorio;
import com.salud.consultorio.service.IRolesAsignablesServicio;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class RolesAsignablesServicioImpl implements IRolesAsignablesServicio {

    private static final String ROL_PACIENTE = "paciente";
    private static final String ROL_MEDICO = "medico";

    private final IPersonaRepositorio personaRepositorio;
    private final IUsuarioRepositorio usuarioRepositorio;
    private final IUsuarioRolRepositorio usuarioRolRepositorio;
    private final IEmpleadoRepositorio empleadoRepositorio;
    private final IRolRepositorio rolRepositorio;

    @Transactional(readOnly = true)
    @Override
    public List<PersonaUsuarioDTO> listarPersonasSinUsuario() {
        return usuarioRepositorio.listarPersonasParaCrearUsuario();
    }

    @Transactional(readOnly = true)
    @Override
    public RolesAsignablesDTO obtener(Integer idPersona) {

        Persona persona = personaRepositorio.findById(idPersona)
                .orElseThrow(() -> new EntityNotFoundException("No existe la persona indicada"));

        if (usuarioRepositorio.existeUsuarioPersona(idPersona)) {
            throw new DataIntegrityViolationException(
                    "La persona ya tiene una cuenta de usuario. Para darle otro rol, gestiona los roles de su cuenta existente"
            );
        }

        boolean esPaciente = usuarioRolRepositorio.personaEsPacienteActivo(idPersona);
        boolean esEmpleado = usuarioRolRepositorio.personaEsEmpleadoActivo(idPersona);

        if (!esPaciente && !esEmpleado) {
            throw new IllegalArgumentException(
                    "La persona no está registrada como paciente ni como empleado activo"
            );
        }

        boolean esMedico = esEmpleado && usuarioRolRepositorio.personaEsMedicoActivo(idPersona);

        Cargo cargo = esEmpleado
                ? empleadoRepositorio.findByPersonaId(idPersona).map(Empleado::getCargo).orElse(null)
                : null;

        List<Rol> activos = rolRepositorio.findAll().stream()
                .filter(rol -> Integer.valueOf(1).equals(rol.getEstado()))
                .sorted(Comparator.comparing(Rol::getNombre))
                .toList();

        List<RolOpcionDTO> opciones = new ArrayList<>();
        List<String> avisos = new ArrayList<>();

        if (esPaciente) {
            Rol paciente = activos.stream()
                    .filter(this::esRolPaciente)
                    .findFirst()
                    .orElseThrow(() -> new EntityNotFoundException("El rol PACIENTE no existe o no está activo"));

            opciones.add(new RolOpcionDTO(paciente.getId(), paciente.getNombre(), true, true));
        }

        if (esEmpleado) {

            List<Rol> laborales = activos.stream()
                    .filter(rol -> !esRolPaciente(rol))
                    .filter(rol -> esMedico || !esRolMedico(rol))
                    .toList();

            Rol recomendado = recomendar(laborales, cargo, esMedico);

            laborales.forEach(rol -> opciones.add(new RolOpcionDTO(
                    rol.getId(),
                    rol.getNombre(),
                    false,
                    recomendado != null && recomendado.getId().equals(rol.getId())
            )));

            if (cargo != null && cargo.isEsPersonalMedico() && !esMedico) {
                avisos.add("El cargo es de personal médico, pero la persona no tiene un registro de médico activo. "
                        + "Regístrala como médico para poder asignar el rol MEDICO.");
            }

            if (recomendado == null && cargo != null) {
                avisos.add("El cargo \"" + cargo.getNombre()
                        + "\" no tiene un rol equivalente directo. Selecciona el rol que corresponda.");
            }
        }

        return new RolesAsignablesDTO(
                persona.getId(),
                persona.getNombre() + " " + persona.getApellidos(),
                persona.getNumeroDocumento(),
                esPaciente,
                esEmpleado,
                esMedico,
                cargo == null ? null : cargo.getNombre(),
                opciones,
                avisos
        );
    }

    private Rol recomendar(List<Rol> laborales, Cargo cargo, boolean esMedico) {

        if (esMedico) {
            return laborales.stream().filter(this::esRolMedico).findFirst().orElse(null);
        }

        if (cargo == null) {
            return null;
        }

        String nombreCargo = normalizar(cargo.getNombre());

        return laborales.stream()
                .filter(rol -> normalizar(rol.getNombre()).equals(nombreCargo))
                .findFirst()
                .orElse(null);
    }

    private boolean esRolPaciente(Rol rol) {
        return ROL_PACIENTE.equals(normalizar(rol.getNombre()));
    }

    private boolean esRolMedico(Rol rol) {
        return ROL_MEDICO.equals(normalizar(rol.getNombre()));
    }

    private String normalizar(String texto) {
        return Normalizer.normalize(texto == null ? "" : texto, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .trim()
                .toLowerCase(Locale.ROOT);
    }
}