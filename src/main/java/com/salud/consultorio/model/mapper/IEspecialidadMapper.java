package com.salud.consultorio.model.mapper;

import com.salud.consultorio.dto.especialidad.EspecialidadActualizarDTO;
import com.salud.consultorio.dto.especialidad.EspecialidadCrearDTO;
import com.salud.consultorio.dto.especialidad.EspecialidadRespuestaDTO;
import com.salud.consultorio.model.entity.Especialidad;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface IEspecialidadMapper {


    @Mapping(target = "id",ignore = true)
    @Mapping(target = "estado",ignore = true)
    Especialidad toEntity(EspecialidadCrearDTO dto);

    EspecialidadRespuestaDTO toDto(Especialidad entidad);

    @Mapping(target = "id",ignore = true)
    @Mapping(target = "estado",ignore = true)
    void updateFromDto(EspecialidadActualizarDTO dto, @MappingTarget Especialidad entidad);



}