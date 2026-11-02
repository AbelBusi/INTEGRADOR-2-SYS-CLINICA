package com.salud.consultorio.model.mapper;

import com.salud.consultorio.dto.diagnostico.DiagnosticoRespuestaDTO;
import com.salud.consultorio.model.entity.Diagnostico;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface IDiagnosticoMapper {

    @Mapping(source = "citaMedica.id", target = "idCitaMedica")
    DiagnosticoRespuestaDTO toDto(Diagnostico entidad);

    List<DiagnosticoRespuestaDTO> toDtoList(List<Diagnostico> entidades);

}