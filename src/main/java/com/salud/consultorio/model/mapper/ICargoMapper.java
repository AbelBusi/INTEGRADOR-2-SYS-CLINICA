package com.salud.consultorio.model.mapper;

import com.salud.consultorio.dto.cargo.CargoActualizarDTO;
import com.salud.consultorio.dto.cargo.CargoCrearDTO;
import com.salud.consultorio.dto.cargo.CargoRespuestaDTO;
import com.salud.consultorio.model.entity.Cargo;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ICargoMapper {


    @Mapping(target = "id",ignore = true)
    Cargo toEntity(CargoCrearDTO dto);

    CargoRespuestaDTO toDto(Cargo entidad);

    void updateFromDto(CargoActualizarDTO dto, @MappingTarget Cargo entidad);



}