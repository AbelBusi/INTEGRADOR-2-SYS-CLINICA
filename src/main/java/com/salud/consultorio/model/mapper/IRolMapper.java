package com.salud.consultorio.model.mapper;

import com.salud.consultorio.dto.rol.RolRefDTO;
import com.salud.consultorio.dto.rol.RolRespuestaDTO;
import com.salud.consultorio.model.entity.Rol;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface IRolMapper {

    RolRespuestaDTO toDto (Rol rol);

    Rol rolRefDtoToRol(RolRefDTO dto);

}