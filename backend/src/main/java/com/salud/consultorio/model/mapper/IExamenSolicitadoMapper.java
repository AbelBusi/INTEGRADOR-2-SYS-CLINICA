package com.salud.consultorio.model.mapper;

import com.salud.consultorio.dto.examenSolicitado.ExamenSolicitadoRespuestaDTO;
import com.salud.consultorio.model.entity.ExamenSolicitado;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface IExamenSolicitadoMapper {

    @Mapping(source = "diagnostico.id", target = "idDiagnostico")
    ExamenSolicitadoRespuestaDTO toDto(ExamenSolicitado entidad);

    List<ExamenSolicitadoRespuestaDTO> toDtoList(List<ExamenSolicitado> entidades);

}