package com.salud.consultorio.model.mapper;

import com.salud.consultorio.dto.indicacion.IndicacionRespuestaDTO;
import com.salud.consultorio.model.entity.Diagnostico;
import com.salud.consultorio.model.entity.Indicacion;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-11-02T17:31:24-0500",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.6 (Oracle Corporation)"
)
@Component
public class IIndicacionMapperImpl implements IIndicacionMapper {

    @Override
    public IndicacionRespuestaDTO toDto(Indicacion entidad) {
        if ( entidad == null ) {
            return null;
        }

        Integer idDiagnostico = null;
        Integer id = null;
        String tipoIndicacion = null;
        String descripcion = null;
        Integer diasReposo = null;
        String frecuencia = null;
        Integer estado = null;

        idDiagnostico = entidadDiagnosticoId( entidad );
        id = entidad.getId();
        tipoIndicacion = entidad.getTipoIndicacion();
        descripcion = entidad.getDescripcion();
        diasReposo = entidad.getDiasReposo();
        frecuencia = entidad.getFrecuencia();
        estado = entidad.getEstado();

        IndicacionRespuestaDTO indicacionRespuestaDTO = new IndicacionRespuestaDTO( id, idDiagnostico, tipoIndicacion, descripcion, diasReposo, frecuencia, estado );

        return indicacionRespuestaDTO;
    }

    @Override
    public List<IndicacionRespuestaDTO> toDtoList(List<Indicacion> entidades) {
        if ( entidades == null ) {
            return null;
        }

        List<IndicacionRespuestaDTO> list = new ArrayList<IndicacionRespuestaDTO>( entidades.size() );
        for ( Indicacion indicacion : entidades ) {
            list.add( toDto( indicacion ) );
        }

        return list;
    }

    private Integer entidadDiagnosticoId(Indicacion indicacion) {
        Diagnostico diagnostico = indicacion.getDiagnostico();
        if ( diagnostico == null ) {
            return null;
        }
        return diagnostico.getId();
    }
}
