package com.salud.consultorio.impl;

import com.salud.consultorio.dto.paciente.*;
import com.salud.consultorio.dto.persona.PersonaActualizarDTO;
import com.salud.consultorio.model.entity.Paciente;
import com.salud.consultorio.model.entity.Persona;
import com.salud.consultorio.model.enums.EntidadEstado;
import com.salud.consultorio.model.mapper.IPacienteMapper;
import com.salud.consultorio.model.mapper.IPersonaMapper;
import com.salud.consultorio.repository.IPacienteRepositorio;
import com.salud.consultorio.service.IPacienteServicio;
import com.salud.consultorio.service.IPersonaServicio;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PacienteServicioImpl implements IPacienteServicio {

    private final IPacienteRepositorio pacienteRepositorio;
    private final IPersonaServicio personaServicio;
    private final IPacienteMapper pacienteMapper;

    @Transactional(readOnly = true)
    @Override
    public PacienteDetalleDTO entidadPorID(Integer id) {

        if (id == null || id <= 0) {
            throw new IllegalArgumentException("El ID del paciente debe ser válido");
        }

        return pacienteRepositorio.buscarDetallePorId(id)
                .orElseThrow(() ->
                        new EntityNotFoundException(
                                "No se encontró el paciente con ID: " + id
                        )
                );
    }

    @Override
    public List<PacienteLeerDTO> lista(EntidadEstado estado) {
        return listaPorEstado(estado);
    }

    @Transactional
    @Override
    public PacienteRespuestaDTO actualizar(PacienteActualizarDTO dto, Integer id) {

        Paciente paciente = pacienteRepositorio.findById(id).orElseThrow(
                ()-> new EntityNotFoundException("El paciente que desea actualizar no existe")
        );

        validarDatosUnicos(dto,id);

        personaServicio.actualizar(dto.persona(), paciente.getPersona().getId());

        pacienteMapper.updateFromDto(dto,paciente);

        return pacienteMapper.toDto(paciente);

    }



    @Transactional
    @Override
    public PacienteRespuestaDTO crear(PacienteCrearDTO dto) {

        if (existeNrCodigoAegurado(dto.codigoAsegurado())) {
            throw new DataIntegrityViolationException("No se puede duplicar codigos de seguro");
        }

        Paciente paciente = pacienteMapper.toEntity(dto);

        Persona persona = personaServicio.crear(dto.persona());

        paciente.setPersona(persona);

        Paciente guardado = pacienteRepositorio.save(paciente);

        return pacienteMapper.toDto(guardado);

    }

    @Transactional
    @Override
    public void eliminarPorId(Integer id) {

        if (!pacienteRepositorio.existsById(id)) {

            throw new EntityNotFoundException("El paciente que desea eliminar no existe.");

        }

        pacienteRepositorio.eliminarLogicamente(id);

    }

    @Override
    public boolean existeNrCodigoAegurado(String codigo) {
        return false;
    }

    @Transactional
    @Override
    public void cambiarEstado(Integer id, EntidadEstado estado) {

        Paciente paciente = validarCambiarEstado(id, estado);

        if (paciente.getEstado() == 0) {
            throw new IllegalArgumentException("No se puede cambiar el estado de una paciente eliminado.");
        }

        if (estado == EntidadEstado.ACTIVO) {

            if (paciente.getEstado() == 1) {
                throw new IllegalArgumentException("No se puede activar un estado que ya se encuentra Activo");
            }

            pacienteRepositorio.activarLogicamente(paciente.getId());

        }

        if (estado == EntidadEstado.INACTIVO) {

            if (paciente.getEstado() == 2) {
                throw new IllegalArgumentException("No se puede desactivar un estado que ya se encuentra desactivado");
            }

            pacienteRepositorio.desactivarLogicamente(paciente.getId());

        }
    }

    private Paciente validarCambiarEstado(Integer id, EntidadEstado estado) {

        if (id == null || estado == null) {
            throw new IllegalArgumentException("El id y el estado son obligatorios.");
        }

        return pacienteRepositorio.findById(id).orElseThrow(
                () -> new EntityNotFoundException("El paciente que desea cambiarle el estado, no existe.")
        );

    }

    @Transactional(readOnly = true)
    private List<PacienteLeerDTO> listaPorEstado(EntidadEstado estado) {

        if (estado != null) {

            if (estado == EntidadEstado.ACTIVO) {

                return pacienteRepositorio.listaPorEstado(1);

            }

            if (estado == EntidadEstado.INACTIVO) {

                return pacienteRepositorio.listaPorEstado(2);

            }

        }

        return pacienteRepositorio.listaPorEstadoActivoInactivo();

    }

    @Transactional(readOnly = true)
    private void validarDatosUnicos(PacienteActualizarDTO dto, Integer id) {

        if (pacienteRepositorio.existsByCodigoAseguradoAndIdNot(
                dto.codigoAsegurado(), id)) {

            throw new DataIntegrityViolationException(
                    "El codigo de aseguradora ya pertenece a otra persona"
            );
        }

    }

}