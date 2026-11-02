package com.salud.consultorio.model.mapper;

import com.salud.consultorio.dto.indicacion.IndicacionRespuestaDTO;
import com.salud.consultorio.model.entity.Indicacion;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface IIndicacionMapper {

    @Mapping(source = "diagnostico.id", target = "idDiagnostico")
    IndicacionRespuestaDTO toDto(Indicacion entidad);

    List<IndicacionRespuestaDTO> toDtoList(List<Indicacion> entidades);

}