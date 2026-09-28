package com.salud.consultorio.model.mapper;

import com.salud.consultorio.dto.persona.PersonaActualizarDTO;
import com.salud.consultorio.dto.persona.PersonaCrearDTO;
import com.salud.consultorio.dto.persona.PersonaRefDTO;
import com.salud.consultorio.model.entity.Persona;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface IPersonaMapper {


    @Mapping(target = "id",ignore = true)
    Persona personaDtoToPersona (PersonaCrearDTO personaCrearDTO);

    @Mapping(target = "id", ignore = true)
    void updateFromDto(PersonaActualizarDTO personaActualizarDTO, @MappingTarget Persona persona);

    PersonaActualizarDTO toDto(Persona persona);

    Persona personaRefDtoToPersona(PersonaRefDTO dto);

}