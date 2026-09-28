package com.salud.consultorio.model.mapper;

import com.salud.consultorio.dto.doctor.EspecialidadRefDoctorDTO;
import com.salud.consultorio.dto.recepcionista.RecepcionistaActualizarDTO;
import com.salud.consultorio.dto.recepcionista.RecepcionistaCrearDTO;
import com.salud.consultorio.dto.recepcionista.RecepcionistaRefCitaMedicaDTO;
import com.salud.consultorio.dto.recepcionista.RecepcionistaRespuestaDTO;
import com.salud.consultorio.model.entity.Especialidad;
import com.salud.consultorio.model.entity.Recepcionista;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface IRecepnionistaMapper {

    @Mapping(target = "id",ignore = true)
    @Mapping(target = "citas",ignore = true)
    @Mapping(target = "persona",ignore = true)
    Recepcionista recepcionistaDtoToRecepcionista(RecepcionistaCrearDTO recepcionistaCrearDTO);

    RecepcionistaRespuestaDTO toDto(Recepcionista recepcionista);

    Recepcionista recepcionistaRefCitaDtoToRecepcionista(RecepcionistaRefCitaMedicaDTO dto);


    @Mapping(target = "persona",ignore = true)
    void updateFromDto(RecepcionistaActualizarDTO dto,@MappingTarget Recepcionista recepcionista);

}