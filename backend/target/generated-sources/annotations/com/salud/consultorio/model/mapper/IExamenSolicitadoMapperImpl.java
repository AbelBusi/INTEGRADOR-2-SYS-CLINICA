package com.salud.consultorio.model.mapper;

import com.salud.consultorio.dto.examenSolicitado.ExamenSolicitadoRespuestaDTO;
import com.salud.consultorio.model.entity.Diagnostico;
import com.salud.consultorio.model.entity.ExamenSolicitado;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-11-04T16:05:00-0500",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.6 (Oracle Corporation)"
)
@Component
public class IExamenSolicitadoMapperImpl implements IExamenSolicitadoMapper {

    @Override
    public ExamenSolicitadoRespuestaDTO toDto(ExamenSolicitado entidad) {
        if ( entidad == null ) {
            return null;
        }

        Integer idDiagnostico = null;
        Integer id = null;
        String nombreExamen = null;
        String tipoExamen = null;
        String motivo = null;
        String indicaciones = null;
        String prioridad = null;
        Boolean requiereAyuno = null;
        LocalDateTime fechaSolicitud = null;
        String observacion = null;

        idDiagnostico = entidadDiagnosticoId( entidad );
        id = entidad.getId();
        nombreExamen = entidad.getNombreExamen();
        tipoExamen = entidad.getTipoExamen();
        motivo = entidad.getMotivo();
        indicaciones = entidad.getIndicaciones();
        prioridad = entidad.getPrioridad();
        requiereAyuno = entidad.getRequiereAyuno();
        fechaSolicitud = entidad.getFechaSolicitud();
        observacion = entidad.getObservacion();

        ExamenSolicitadoRespuestaDTO examenSolicitadoRespuestaDTO = new ExamenSolicitadoRespuestaDTO( id, idDiagnostico, nombreExamen, tipoExamen, motivo, indicaciones, prioridad, requiereAyuno, fechaSolicitud, observacion );

        return examenSolicitadoRespuestaDTO;
    }

    @Override
    public List<ExamenSolicitadoRespuestaDTO> toDtoList(List<ExamenSolicitado> entidades) {
        if ( entidades == null ) {
            return null;
        }

        List<ExamenSolicitadoRespuestaDTO> list = new ArrayList<ExamenSolicitadoRespuestaDTO>( entidades.size() );
        for ( ExamenSolicitado examenSolicitado : entidades ) {
            list.add( toDto( examenSolicitado ) );
        }

        return list;
    }

    private Integer entidadDiagnosticoId(ExamenSolicitado examenSolicitado) {
        Diagnostico diagnostico = examenSolicitado.getDiagnostico();
        if ( diagnostico == null ) {
            return null;
        }
        return diagnostico.getId();
    }
}
