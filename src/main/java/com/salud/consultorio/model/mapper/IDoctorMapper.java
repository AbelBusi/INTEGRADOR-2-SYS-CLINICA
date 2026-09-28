package com.salud.consultorio.model.mapper;

import com.salud.consultorio.dto.citaMedica.DoctorRefCitaMedicaDTO;
import com.salud.consultorio.dto.doctor.DoctorActualizarDTO;
import com.salud.consultorio.dto.doctor.DoctorCrearDTO;
import com.salud.consultorio.dto.doctor.DoctorRespuestaDTO;
import com.salud.consultorio.dto.doctor.EspecialidadRefDoctorDTO;
import com.salud.consultorio.model.entity.Doctor;
import com.salud.consultorio.model.entity.Especialidad;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface IDoctorMapper {


    @Mapping(target = "id",ignore = true)
    @Mapping(target = "horarios",ignore = true)
    @Mapping(target = "citaMedicas",ignore = true)
    @Mapping(target = "especialidad",ignore = true)
    @Mapping(target = "persona",ignore = true)
    Doctor doctordDtoToDoctor (DoctorCrearDTO doctorCrearDTO);

    Doctor doctorRefCitaDtoToDoctor(DoctorRefCitaMedicaDTO dto);

    DoctorRespuestaDTO toDto(Doctor doctor);

    @Mapping(target = "especialidad",ignore = true)
    @Mapping(target = "persona",ignore = true)
    void updateFromDto(DoctorActualizarDTO actualizarDTO, @MappingTarget Doctor doctor);

}