package com.salud.consultorio.model.mapper;

import com.salud.consultorio.auth.dto.rol.*;
import com.salud.consultorio.model.entity.Rol;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface IRolMapper {

    RolRespuestaDTO toDto (Rol rol);

    Rol rolRefDtoToRol(RolRefDTO dto);

    Rol toEntity(RolCrearDTO entidad);

    IRolRespuestaDTO toDtoRol(Rol rol);

    @Mapping(target = "id",ignore = true)
    @Mapping(target = "estado",ignore = true)
    void updateFromDto(RolActualizarDTO dto, @MappingTarget Rol entidad);

}