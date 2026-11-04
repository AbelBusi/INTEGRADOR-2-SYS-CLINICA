package com.salud.consultorio.model.mapper;

import com.salud.consultorio.dto.horarioAtencion.HorarioActualizarDTO;
import com.salud.consultorio.dto.horarioAtencion.HorarioAtencionDTO;
import com.salud.consultorio.dto.horarioAtencion.HorarioAtencionRespuesta;
import com.salud.consultorio.dto.horarioAtencion.HorarioAtencionRespuestaDTO;
import com.salud.consultorio.model.entity.Empleado;
import com.salud.consultorio.model.entity.HorarioAtencion;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-11-04T16:05:01-0500",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.6 (Oracle Corporation)"
)
@Component
public class IHorarioAtencionMapperImpl implements IHorarioAtencionMapper {

    @Override
    public HorarioAtencion toEntity(Empleado empleado, HorarioAtencionDTO dto, LocalDate fechaInicio, LocalDate fechaFin) {
        if ( empleado == null && dto == null && fechaInicio == null && fechaFin == null ) {
            return null;
        }

        HorarioAtencion.HorarioAtencionBuilder horarioAtencion = HorarioAtencion.builder();

        if ( dto != null ) {
            horarioAtencion.diaSemana( dto.diaSemana() );
            horarioAtencion.horaEntrada( dto.horaEntrada() );
            horarioAtencion.horaSalida( dto.horaSalida() );
        }
        horarioAtencion.empleado( empleado );
        horarioAtencion.fechaInicio( fechaInicio );
        horarioAtencion.fechaFin( fechaFin );

        return horarioAtencion.build();
    }

    @Override
    public HorarioAtencionRespuesta toDto(Integer idEmpleado, List<HorarioAtencion> horarios) {
        if ( idEmpleado == null && horarios == null ) {
            return null;
        }

        Integer idEmpleado1 = null;
        idEmpleado1 = idEmpleado;
        List<HorarioAtencionRespuestaDTO> horarios1 = null;
        horarios1 = horarioAtencionListToHorarioAtencionRespuestaDTOList( horarios );

        HorarioAtencionRespuesta horarioAtencionRespuesta = new HorarioAtencionRespuesta( idEmpleado1, horarios1 );

        return horarioAtencionRespuesta;
    }

    @Override
    public HorarioAtencionRespuestaDTO toRespuestaDTO(HorarioAtencion horario) {
        if ( horario == null ) {
            return null;
        }

        Integer idHorario = null;
        Integer diaSemana = null;
        LocalTime horaEntrada = null;
        LocalTime horaSalida = null;
        LocalDate fechaInicio = null;
        LocalDate fechaFin = null;

        idHorario = horario.getId();
        diaSemana = horario.getDiaSemana();
        horaEntrada = horario.getHoraEntrada();
        horaSalida = horario.getHoraSalida();
        fechaInicio = horario.getFechaInicio();
        fechaFin = horario.getFechaFin();

        HorarioAtencionRespuestaDTO horarioAtencionRespuestaDTO = new HorarioAtencionRespuestaDTO( idHorario, diaSemana, horaEntrada, horaSalida, fechaInicio, fechaFin );

        return horarioAtencionRespuestaDTO;
    }

    @Override
    public void actualizar(HorarioActualizarDTO dto, HorarioAtencion horario) {
        if ( dto == null ) {
            return;
        }

        horario.setDiaSemana( dto.diaSemana() );
        horario.setHoraEntrada( dto.horaEntrada() );
        horario.setHoraSalida( dto.horaSalida() );
        horario.setFechaInicio( dto.fechaInicio() );
        horario.setFechaFin( dto.fechaFin() );
    }

    protected List<HorarioAtencionRespuestaDTO> horarioAtencionListToHorarioAtencionRespuestaDTOList(List<HorarioAtencion> list) {
        if ( list == null ) {
            return null;
        }

        List<HorarioAtencionRespuestaDTO> list1 = new ArrayList<HorarioAtencionRespuestaDTO>( list.size() );
        for ( HorarioAtencion horarioAtencion : list ) {
            list1.add( toRespuestaDTO( horarioAtencion ) );
        }

        return list1;
    }
}
