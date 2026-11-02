package com.salud.consultorio.model.mapper;

import com.salud.consultorio.dto.derivacion.DerivacionRespuestaDTO;
import com.salud.consultorio.model.entity.Derivacion;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface IDerivacionMapper {

    @Mapping(source = "diagnostico.id", target = "idDiagnostico")
    @Mapping(source = "especialidad.id", target = "idEspecialidad")
    @Mapping(source = "especialidad.nombre", target = "nombreEspecialidad")
    DerivacionRespuestaDTO toDto(Derivacion entidad);

    List<DerivacionRespuestaDTO> toDtoList(List<Derivacion> entidades);

}