package com.salud.consultorio.model.mapper;

import com.salud.consultorio.dto.citaMedica.EspecialidadRefCitaMedicaDTO;
import com.salud.consultorio.dto.doctor.EspecialidadRefDoctorDTO;
import com.salud.consultorio.dto.especialidad.EspecialidadActualizarDTO;
import com.salud.consultorio.dto.especialidad.EspecialidadCrearDTO;
import com.salud.consultorio.dto.especialidad.EspecialidadRespuestaDTO;
import com.salud.consultorio.model.entity.Especialidad;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface IEspecialidadMapper {


    @Mapping(target = "id",ignore = true)
    @Mapping(target = "doctores",ignore = true)
    @Mapping(target = "citaMedicas",ignore = true)
    Especialidad especialidadDtoToEspecialidad (EspecialidadCrearDTO especialidadCrearDTO);

    Especialidad especialidadRefDtoToEspecialidad(EspecialidadRefDoctorDTO especialidadRefDoctorDTO);

    Especialidad especialidadRefCitaDtoToEspecialidad(EspecialidadRefCitaMedicaDTO dto);


    EspecialidadRespuestaDTO toDto(Especialidad especialidad);

    void updateFromDto(EspecialidadActualizarDTO dto, @MappingTarget Especialidad especialidad);



}