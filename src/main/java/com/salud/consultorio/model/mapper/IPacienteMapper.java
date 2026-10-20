package com.salud.consultorio.model.mapper;

import com.salud.consultorio.dto.paciente.*;
import com.salud.consultorio.model.entity.Paciente;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface IPacienteMapper {

    @Mapping(target = "id",ignore = true)
    @Mapping(target = "persona",ignore = true)
    @Mapping(target = "estado",ignore = true)
    Paciente toEntity(PacienteCrearDTO pacienteCrearDTO);

    @Mapping(target = "id",ignore = true)
    @Mapping(target = "persona",ignore = true)
    @Mapping(target = "estado",ignore = true)
    Paciente toEntity(EmpleadoConvertirPacienteDTO dto);

    PacienteRespuestaDTO toDto(Paciente paciente);

    EmpleadoConvertidoPacienteRespuestaDTO toDtoEntity(Paciente entidad);

    @Mapping(target = "id",ignore = true)
    @Mapping(target = "persona",ignore = true)
    void updateFromDto(PacienteActualizarDTO actualizarDTO, @MappingTarget Paciente paciente);

}