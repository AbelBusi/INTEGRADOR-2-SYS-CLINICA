package com.salud.consultorio.model.mapper;

import com.salud.consultorio.dto.tratamiento.TratamientoRespuestaDTO;
import com.salud.consultorio.model.entity.Diagnostico;
import com.salud.consultorio.model.entity.Tratamiento;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-11-04T16:05:02-0500",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.6 (Oracle Corporation)"
)
@Component
public class ITratamientoMapperImpl implements ITratamientoMapper {

    @Override
    public TratamientoRespuestaDTO toDto(Tratamiento entidad) {
        if ( entidad == null ) {
            return null;
        }

        Integer idDiagnostico = null;
        Integer id = null;
        String nombreMedicamento = null;
        String dosis = null;
        String viaAdministracion = null;
        String frecuencia = null;
        Integer duracionDias = null;
        Integer totCantidad = null;
        String descIndicacion = null;
        Integer estado = null;

        idDiagnostico = entidadDiagnosticoId( entidad );
        id = entidad.getId();
        nombreMedicamento = entidad.getNombreMedicamento();
        dosis = entidad.getDosis();
        viaAdministracion = entidad.getViaAdministracion();
        frecuencia = entidad.getFrecuencia();
        duracionDias = entidad.getDuracionDias();
        totCantidad = entidad.getTotCantidad();
        descIndicacion = entidad.getDescIndicacion();
        estado = entidad.getEstado();

        TratamientoRespuestaDTO tratamientoRespuestaDTO = new TratamientoRespuestaDTO( id, idDiagnostico, nombreMedicamento, dosis, viaAdministracion, frecuencia, duracionDias, totCantidad, descIndicacion, estado );

        return tratamientoRespuestaDTO;
    }

    @Override
    public List<TratamientoRespuestaDTO> toDtoList(List<Tratamiento> entidades) {
        if ( entidades == null ) {
            return null;
        }

        List<TratamientoRespuestaDTO> list = new ArrayList<TratamientoRespuestaDTO>( entidades.size() );
        for ( Tratamiento tratamiento : entidades ) {
            list.add( toDto( tratamiento ) );
        }

        return list;
    }

    private Integer entidadDiagnosticoId(Tratamiento tratamiento) {
        Diagnostico diagnostico = tratamiento.getDiagnostico();
        if ( diagnostico == null ) {
            return null;
        }
        return diagnostico.getId();
    }
}
