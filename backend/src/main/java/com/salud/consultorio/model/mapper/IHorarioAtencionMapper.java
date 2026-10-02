package com.salud.consultorio.model.mapper;

import com.salud.consultorio.dto.horarioAtencion.HorarioAtencionDTO;
import com.salud.consultorio.dto.horarioAtencion.HorarioAtencionRespuesta;
import com.salud.consultorio.model.entity.Empleado;
import com.salud.consultorio.model.entity.HorarioAtencion;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface IHorarioAtencionMapper {

    @Mapping(target = "empleado", source = "empleado")
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "estado", ignore = true)
    HorarioAtencion toEntity (Empleado empleado, HorarioAtencionDTO dto);

    HorarioAtencionRespuesta toDto(Integer id, List<HorarioAtencionDTO> dto);

}