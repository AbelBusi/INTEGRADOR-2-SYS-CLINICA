package com.backend.salud.model.mapper;

import com.backend.salud.dto.citaMedica.PacienteRefCitaMedicaDTO;
import com.backend.salud.dto.paciente.PacienteActualizarDTO;
import com.backend.salud.dto.paciente.PacienteCrearDTO;
import com.backend.salud.dto.paciente.PacienteRespuestaDTO;
import com.backend.salud.model.entity.Paciente;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface IPacienteMapper {

    @Mapping(target = "id",ignore = true)
    @Mapping(target = "persona",ignore = true)
    @Mapping(target = "citaMedicas",ignore = true)
    Paciente pacienteDtoToPaciente (PacienteCrearDTO pacienteCrearDTO);

    Paciente pacienteRefCitaDtoToPaciente(PacienteRefCitaMedicaDTO dto);

    PacienteRespuestaDTO toDto(Paciente paciente);

    @Mapping(target = "id",ignore = true)
    @Mapping(target = "persona",ignore = true)
    void updateFromDto(PacienteActualizarDTO actualizarDTO, @MappingTarget Paciente paciente);
}
