package com.salud.consultorio.model.mapper;

import com.salud.consultorio.dto.persona.PersonaActualizarDTO;
import com.salud.consultorio.dto.persona.PersonaCrearDTO;
import com.salud.consultorio.dto.persona.PersonaRefDTO;
import com.salud.consultorio.model.entity.Persona;
import com.salud.consultorio.model.entity.TipoDocumento;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface IPersonaMapper {

    @Mapping(target = "id",ignore = true)
    @Mapping(target = "tipoDocumento",source = "tipoDocumento")
    @Mapping(target = "estado", ignore = true)
    Persona toEntity(PersonaCrearDTO personaCrearDTO, TipoDocumento tipoDocumento);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "tipoDocumento", ignore = true)
    @Mapping(target = "fechaCreacion", ignore = true)
    @Mapping(target = "fechaActualizacion", ignore = true)
    @Mapping(target = "estado", ignore = true)
    void updateFromDto(PersonaActualizarDTO personaActualizarDTO, @MappingTarget Persona persona);

    @Mapping(target = "tipoDocumento", source = "tipoDocumento.idTipoDocumento")
    PersonaActualizarDTO toDto(Persona persona);

    Persona personaRefDtoToPersona(PersonaRefDTO dto);

}