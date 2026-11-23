package com.salud.consultorio.model.mapper;

import com.salud.consultorio.dto.historiaClinica.AlergiaRespuestaDTO;
import com.salud.consultorio.dto.historiaClinica.AntecedenteFamiliarRespuestaDTO;
import com.salud.consultorio.dto.historiaClinica.AntecedentePersonalRespuestaDTO;
import com.salud.consultorio.model.entity.Alergia;
import com.salud.consultorio.model.entity.AntecedenteFamiliar;
import com.salud.consultorio.model.entity.AntecedentePersonal;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface IHistoriaClinicaMapper {

    AntecedentePersonalRespuestaDTO toDto(AntecedentePersonal entidad);

    AntecedenteFamiliarRespuestaDTO toDto(AntecedenteFamiliar entidad);

    AlergiaRespuestaDTO toDto(Alergia entidad);

}