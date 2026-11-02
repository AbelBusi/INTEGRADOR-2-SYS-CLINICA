package com.salud.consultorio.model.mapper;

import com.salud.consultorio.dto.empleado.*;
import com.salud.consultorio.model.entity.Empleado;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface IEmpleadoMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "persona", ignore = true)
    @Mapping(target = "cargo", ignore = true)
    @Mapping(target = "foto", ignore = true)
    @Mapping(target = "fechaIngreso", ignore = true)
    @Mapping(target = "fechaRetiro", ignore = true)
    @Mapping(target = "estado", ignore = true)
    Empleado toEntity(EmpleadoCrearDTO dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "persona", ignore = true)
    @Mapping(target = "cargo", ignore = true)
    @Mapping(target = "foto", ignore = true)
    @Mapping(target = "fechaIngreso", ignore = true)
    @Mapping(target = "fechaRetiro", ignore = true)
    @Mapping(target = "estado", ignore = true)
    Empleado toEntity(ConvertirPacienteEmpledo dto);

    @Mapping(target = "idPersona", source = "persona.id")
    @Mapping(target = "idCargo", source = "cargo.id")
    @Mapping(target = "cargo", source = "cargo.nombre")
    EmpleadoRespuestaDTO toDto(Empleado empleado);

    @Mapping(target = "id", source = "empleado.id")
    @Mapping(target = "idCargo", source = "cargo.id")
    PacienteConvertidoEmpleadoRespuestaDTO toDtoEntity(Empleado empleado);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "persona", ignore = true)
    @Mapping(target = "cargo", ignore = true)
    @Mapping(target = "fechaIngreso", ignore = true)
    @Mapping(target = "fechaRetiro", ignore = true)
    @Mapping(target = "estado", ignore = true)
    void updateFromDto(EmpleadoActualizarDTO dto, @MappingTarget Empleado empleado);

}