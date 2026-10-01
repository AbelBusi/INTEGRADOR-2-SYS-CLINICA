package com.salud.consultorio.impl;

import com.salud.consultorio.dto.persona.PersonaActualizarDTO;
import com.salud.consultorio.dto.persona.PersonaCrearDTO;
import com.salud.consultorio.model.entity.Persona;
import com.salud.consultorio.model.entity.TipoDocumento;
import com.salud.consultorio.model.mapper.IPersonaMapper;
import com.salud.consultorio.repository.IPersonaRepositorio;
import com.salud.consultorio.service.IPersonaServicio;
import com.salud.consultorio.service.ITipoDocumentoServicio;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class IPersonaServicioImpl implements IPersonaServicio {

    private final IPersonaRepositorio personaRepositorio;
    private final ITipoDocumentoServicio tipoDocumentoServicio;
    private final IPersonaMapper personaMapper;

    @Transactional
    @Override
    public Persona crear(PersonaCrearDTO dto) {

        TipoDocumento tipoDocumento = tipoDocumentoServicio.obtenerEntidadPorID(dto.tipoDocumento())
                .orElseThrow(()->
                        new EntityNotFoundException("No se encuentra el tipo de documento seleccionado")
                );

        Persona persona =personaMapper.toEntity(dto, tipoDocumento);

        return personaRepositorio.save(persona);

    }

    @Transactional
    @Override
    public Persona actualizar(PersonaActualizarDTO dto, Integer id) {

        Persona persona = personaRepositorio.findById(id).orElseThrow(
                ()-> new EntityNotFoundException("No existe la persona que desea actualizar")
        );

        validarDatosUnicos(dto,id);

        TipoDocumento tipoDocumento = tipoDocumentoServicio.obtenerEntidadPorID(dto.tipoDocumento()).orElseThrow(
                ()-> new EntityNotFoundException("No existe el tipo de documento seleccionado")
        );

        personaMapper.updateFromDto(dto,persona);

        persona.setTipoDocumento(tipoDocumento);

        return persona;

    }

    @Transactional(readOnly = true)
    @Override
    public boolean existePersonaNumeroDocumento(String dni) {
        return personaRepositorio.existsByNumeroDocumento(dni);
    }

    @Transactional(readOnly = true)
    @Override
    public boolean existePersonaCorreo(String correo) {
        return personaRepositorio.existsByCorreo(correo);
    }

    @Transactional(readOnly = true)
    private void validarDatosUnicos(PersonaActualizarDTO dto, Integer id) {

        if (personaRepositorio.existsByNumeroDocumentoAndIdNot(
                dto.numeroDocumento(), id)) {

            throw new DataIntegrityViolationException(
                    "El número de documento ya pertenece a otra persona"
            );
        }

        if (dto.telefono() != null && !dto.telefono().isBlank()
                && personaRepositorio.existsByTelefonoAndIdNot(
                dto.telefono(), id)) {

            throw new DataIntegrityViolationException(
                    "El número de teléfono ya pertenece a otra persona"
            );
        }

        if (dto.correo() != null && !dto.correo().isBlank()
                && personaRepositorio.existsByCorreoAndIdNot(
                dto.correo(), id)) {

            throw new DataIntegrityViolationException(
                    "El correo electrónico ya pertenece a otra persona"
            );
        }
    }

}