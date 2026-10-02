package com.salud.consultorio.model.mapper;

import com.salud.consultorio.dto.doctor.DoctorActualizarDTO;
import com.salud.consultorio.dto.doctor.DoctorCrearDTO;
import com.salud.consultorio.dto.doctor.DoctorRespuestaDTO;
import com.salud.consultorio.model.entity.Doctor;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface IDoctorMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "empleado", ignore = true)
    @Mapping(target = "especialidad", ignore = true)
    @Mapping(target = "estado", ignore = true)
    Doctor toEntity(DoctorCrearDTO dto);

    @Mapping(target = "idEmpleado", source = "empleado.id")
    @Mapping(target = "idEspecialidad", source = "especialidad.id")
    @Mapping(target = "especialidad", source = "especialidad.nombre")
    DoctorRespuestaDTO toDto(Doctor doctor);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "empleado", ignore = true)
    @Mapping(target = "especialidad", ignore = true)
    @Mapping(target = "estado", ignore = true)
    void updateFromDto(DoctorActualizarDTO dto, @MappingTarget Doctor doctor);

}