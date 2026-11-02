package com.salud.consultorio.model.mapper;

import com.salud.consultorio.dto.horarioAtencion.HorarioActualizarDTO;
import com.salud.consultorio.dto.horarioAtencion.HorarioAtencionDTO;
import com.salud.consultorio.dto.horarioAtencion.HorarioAtencionRespuesta;
import com.salud.consultorio.dto.horarioAtencion.HorarioAtencionRespuestaDTO;
import com.salud.consultorio.model.entity.Empleado;
import com.salud.consultorio.model.entity.HorarioAtencion;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.time.LocalDate;
import java.util.List;

@Mapper(componentModel = "spring")
public interface IHorarioAtencionMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "estado", ignore = true)
    @Mapping(target = "empleado", source = "empleado")
    @Mapping(target = "fechaInicio", source = "fechaInicio")
    @Mapping(target = "fechaFin", source = "fechaFin")
    HorarioAtencion toEntity(
            Empleado empleado,
            HorarioAtencionDTO dto,
            LocalDate fechaInicio,
            LocalDate fechaFin
    );

    @Mapping(target = "idEmpleado", source = "idEmpleado")
    @Mapping(target = "horarios", source = "horarios")
    HorarioAtencionRespuesta toDto(Integer idEmpleado, List<HorarioAtencion> horarios);

    @Mapping(target = "idHorario", source = "id")
    HorarioAtencionRespuestaDTO toRespuestaDTO(HorarioAtencion horario);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "empleado", ignore = true)
    @Mapping(target = "estado", ignore = true)
    void actualizar(HorarioActualizarDTO dto, @MappingTarget HorarioAtencion horario);

}