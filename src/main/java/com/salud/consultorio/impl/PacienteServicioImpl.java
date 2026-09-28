package com.salud.consultorio.impl;

import com.salud.consultorio.dto.paciente.*;
import com.salud.consultorio.dto.paciente.NombrePacientesDTO;
import com.salud.consultorio.model.entity.Paciente;
import com.salud.consultorio.model.entity.Persona;
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
    private final IPersonaMapper personaMapper;

    @Transactional
    @Override
    public Optional<Paciente> obtenerPorId(Integer integer) {
        return pacienteRepositorio.findAlTPacientes(integer);
    }

    @Transactional(readOnly = true)
    @Override
    public Optional<Paciente> obtenerPorUsuario(String usuario) {
        return pacienteRepositorio.findByUsuario(usuario);
    }

    @Transactional(readOnly = true)
    @Override
    public Boolean existePaciente(Integer id) {
        return pacienteRepositorio.existsById(id);
    }

    @Transactional
    @Override
    public PacienteRespuestaDTO crear(PacienteCrearDTO dto) {

        if (personaServicio.existePersonaDni(dto.getPersona().getDni())){
            throw new DataIntegrityViolationException("No se puede agregar pacientes con dni duplicado.");
        }

        if (existeNrCodigoAegurado(dto.getCodigoAseguradora())){
            throw new DataIntegrityViolationException("No se puede duplicar codigos de seguro");
        }

        if (personaServicio.existePersonaCorreo(dto.getPersona().getCorreo())){
            throw new DataIntegrityViolationException("No se puede duplicar el correo de una persona");
        }

        Paciente paciente = pacienteMapper.pacienteDtoToPaciente(dto);

        Persona persona = personaMapper.personaDtoToPersona(dto.getPersona());

        paciente.setPersona(persona);

        Paciente guardado= pacienteRepositorio.save(paciente);

        return pacienteMapper.toDto(guardado);
    }

    @Transactional
    @Override
    public PacienteRespuestaDTO actualizarRespuesta(PacienteActualizarDTO actualizarDTO, Integer id) {

        Paciente pacienteExiste = pacienteRepositorio.findByIdConPersona(id).orElseThrow(
                () -> new EntityNotFoundException("No existe el paciente en la entidad"));

        if (pacienteExiste.getPersona()==null){
            throw new IllegalArgumentException("Paciente sin persona asociada");
        }

        String nuevoDni = actualizarDTO.getPersona().getDni();
        String dniActual = pacienteExiste.getPersona().getDni();

        String nuevoCodigo = actualizarDTO.getCodigoAseguradora();
        String codigoActual = pacienteExiste.getCodigoAseguradora();

        boolean cambioDni = !nuevoDni.equalsIgnoreCase(dniActual);

        boolean cambioCodigo = !nuevoCodigo.equalsIgnoreCase(codigoActual);

        if (cambioDni && personaServicio.existePersonaDni(nuevoDni)) {
            throw new DataIntegrityViolationException(
                    "No se puede agregar pacientes con dni duplicado."
            );
        }

        if (cambioCodigo && existeNrCodigoAegurado(nuevoCodigo)) {
            throw new DataIntegrityViolationException(
                    "No se puede duplicar códigos de seguro."
            );
        }


        pacienteMapper.updateFromDto(actualizarDTO, pacienteExiste);

        personaMapper.updateFromDto(actualizarDTO.getPersona(),pacienteExiste.getPersona());

        return pacienteMapper.toDto(pacienteExiste);

    }

    @Transactional
    @Override
    public void eliminarPorId(Integer integer) {

        if (!existePaciente(integer)){
            throw new EntityNotFoundException("El paciente que desea eliminar no existe.");
        }

        pacienteRepositorio.PacienteCambiarEstado(0,integer);

    }

    @Transactional(readOnly = true)
    @Override
    public List<PacienteLeerDTO> listarPacientesActivos() {
        return pacienteRepositorio.leerPacientesAllActivos();
    }

    @Transactional(readOnly = true)
    @Override
    public List<PacienteLeerDTO> listarPacientesInativos() {
        return pacienteRepositorio.leerPacientesAllInactivos();
    }

    @Transactional(readOnly = true)
    @Override
    public boolean existeNrCodigoAegurado(String codigo) {
        return pacienteRepositorio.existsByCodigoAseguradora(codigo);
    }

    @Transactional(readOnly = true)
    @Override
    public List<NombrePacientesDTO> listarPacientesDtoList() {
        return pacienteRepositorio.listarPacientesResumen();
    }

    @Transactional(readOnly = true)
    @Override
    public PacienteDetalleLeerDTO traerPacientePorId(Integer id) {
        return pacienteRepositorio.traerPacientePorId(id).orElseThrow(()-> new EntityNotFoundException("No existe el paciente"));
    }

    @Transactional(readOnly = true)
    @Override
    public List<PacienteLeerDTO> listarPacientes() {
        return pacienteRepositorio.leerPacientesAll();
    }
}