package com.salud.consultorio.model.mapper;

import com.salud.consultorio.dto.diagnostico.DiagnosticoRespuestaDTO;
import com.salud.consultorio.model.entity.CitaMedica;
import com.salud.consultorio.model.entity.Diagnostico;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-11-04T11:30:34-0500",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.6 (Oracle Corporation)"
)
@Component
public class IDiagnosticoMapperImpl implements IDiagnosticoMapper {

    @Override
    public DiagnosticoRespuestaDTO toDto(Diagnostico entidad) {
        if ( entidad == null ) {
            return null;
        }

        Integer idCitaMedica = null;
        Integer id = null;
        String codigo = null;
        String descripcion = null;
        Integer tipoDiagnostico = null;
        String observaciones = null;
        LocalDateTime fecDiagnostico = null;
        Integer estado = null;

        idCitaMedica = entidadCitaMedicaId( entidad );
        id = entidad.getId();
        codigo = entidad.getCodigo();
        descripcion = entidad.getDescripcion();
        tipoDiagnostico = entidad.getTipoDiagnostico();
        observaciones = entidad.getObservaciones();
        fecDiagnostico = entidad.getFecDiagnostico();
        estado = entidad.getEstado();

        DiagnosticoRespuestaDTO diagnosticoRespuestaDTO = new DiagnosticoRespuestaDTO( id, idCitaMedica, codigo, descripcion, tipoDiagnostico, observaciones, fecDiagnostico, estado );

        return diagnosticoRespuestaDTO;
    }

    @Override
    public List<DiagnosticoRespuestaDTO> toDtoList(List<Diagnostico> entidades) {
        if ( entidades == null ) {
            return null;
        }

        List<DiagnosticoRespuestaDTO> list = new ArrayList<DiagnosticoRespuestaDTO>( entidades.size() );
        for ( Diagnostico diagnostico : entidades ) {
            list.add( toDto( diagnostico ) );
        }

        return list;
    }

    private Integer entidadCitaMedicaId(Diagnostico diagnostico) {
        CitaMedica citaMedica = diagnostico.getCitaMedica();
        if ( citaMedica == null ) {
            return null;
        }
        return citaMedica.getId();
    }
}
