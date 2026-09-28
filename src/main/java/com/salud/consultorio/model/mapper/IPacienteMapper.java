package com.salud.consultorio.model.mapper;

import com.salud.consultorio.dto.citaMedica.PacienteRefCitaMedicaDTO;
import com.salud.consultorio.dto.doctor.EspecialidadRefDoctorDTO;
import com.salud.consultorio.dto.paciente.PacienteActualizarDTO;
import com.salud.consultorio.dto.paciente.PacienteCrearDTO;
import com.salud.consultorio.dto.paciente.PacienteRespuestaDTO;
import com.salud.consultorio.model.entity.Especialidad;
import com.salud.consultorio.model.entity.Paciente;
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
