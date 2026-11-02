package com.salud.consultorio.model.mapper;

import com.salud.consultorio.dto.tratamiento.TratamientoRespuestaDTO;
import com.salud.consultorio.model.entity.Tratamiento;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ITratamientoMapper {

    @Mapping(source = "diagnostico.id", target = "idDiagnostico")
    TratamientoRespuestaDTO toDto(Tratamiento entidad);

    List<TratamientoRespuestaDTO> toDtoList(List<Tratamiento> entidades);

}