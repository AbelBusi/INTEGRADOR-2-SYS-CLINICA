package com.salud.consultorio.model.mapper;

import com.salud.consultorio.dto.derivacion.DerivacionRespuestaDTO;
import com.salud.consultorio.model.entity.Derivacion;
import com.salud.consultorio.model.entity.Diagnostico;
import com.salud.consultorio.model.entity.Especialidad;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-11-02T14:44:00-0500",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.6 (Oracle Corporation)"
)
@Component
public class IDerivacionMapperImpl implements IDerivacionMapper {

    @Override
    public DerivacionRespuestaDTO toDto(Derivacion entidad) {
        if ( entidad == null ) {
            return null;
        }

        Integer idDiagnostico = null;
        Integer idEspecialidad = null;
        String nombreEspecialidad = null;
        Integer id = null;
        String codigo = null;
        String motivo = null;
        Integer urgencia = null;
        Integer estado = null;

        idDiagnostico = entidadDiagnosticoId( entidad );
        idEspecialidad = entidadEspecialidadId( entidad );
        nombreEspecialidad = entidadEspecialidadNombre( entidad );
        id = entidad.getId();
        codigo = entidad.getCodigo();
        motivo = entidad.getMotivo();
        urgencia = entidad.getUrgencia();
        estado = entidad.getEstado();

        DerivacionRespuestaDTO derivacionRespuestaDTO = new DerivacionRespuestaDTO( id, idDiagnostico, codigo, idEspecialidad, nombreEspecialidad, motivo, urgencia, estado );

        return derivacionRespuestaDTO;
    }

    @Override
    public List<DerivacionRespuestaDTO> toDtoList(List<Derivacion> entidades) {
        if ( entidades == null ) {
            return null;
        }

        List<DerivacionRespuestaDTO> list = new ArrayList<DerivacionRespuestaDTO>( entidades.size() );
        for ( Derivacion derivacion : entidades ) {
            list.add( toDto( derivacion ) );
        }

        return list;
    }

    private Integer entidadDiagnosticoId(Derivacion derivacion) {
        Diagnostico diagnostico = derivacion.getDiagnostico();
        if ( diagnostico == null ) {
            return null;
        }
        return diagnostico.getId();
    }

    private Integer entidadEspecialidadId(Derivacion derivacion) {
        Especialidad especialidad = derivacion.getEspecialidad();
        if ( especialidad == null ) {
            return null;
        }
        return especialidad.getId();
    }

    private String entidadEspecialidadNombre(Derivacion derivacion) {
        Especialidad especialidad = derivacion.getEspecialidad();
        if ( especialidad == null ) {
            return null;
        }
        return especialidad.getNombre();
    }
}
