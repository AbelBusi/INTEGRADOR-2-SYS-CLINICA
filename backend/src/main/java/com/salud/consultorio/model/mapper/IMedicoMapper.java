package com.salud.consultorio.model.mapper;

import com.salud.consultorio.dto.medico.MedicoActualizarDTO;
import com.salud.consultorio.dto.medico.MedicoCrearDTO;
import com.salud.consultorio.dto.medico.MedicoRespuestaDTO;
import com.salud.consultorio.model.entity.Medico;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface IMedicoMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "empleado", ignore = true)
    @Mapping(target = "especialidad", ignore = true)
    @Mapping(target = "estado", ignore = true)
    Medico toEntity(MedicoCrearDTO dto);

    @Mapping(target = "idEmpleado", source = "empleado.id")
    @Mapping(target = "idEspecialidad", source = "especialidad.id")
    @Mapping(target = "especialidad", source = "especialidad.nombre")
    MedicoRespuestaDTO toDto(Medico medico);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "empleado", ignore = true)
    @Mapping(target = "especialidad", ignore = true)
    @Mapping(target = "estado", ignore = true)
    void updateFromDto(MedicoActualizarDTO dto, @MappingTarget Medico medico);

}