package com.salud.consultorio.model.mapper;

import com.salud.consultorio.dto.especialidad.EspecialidadActualizarDTO;
import com.salud.consultorio.dto.especialidad.EspecialidadCrearDTO;
import com.salud.consultorio.dto.especialidad.EspecialidadRespuestaDTO;
import com.salud.consultorio.model.entity.Especialidad;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-11-02T17:31:26-0500",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.6 (Oracle Corporation)"
)
@Component
public class IEspecialidadMapperImpl implements IEspecialidadMapper {

    @Override
    public Especialidad toEntity(EspecialidadCrearDTO dto) {
        if ( dto == null ) {
            return null;
        }

        Especialidad.EspecialidadBuilder especialidad = Especialidad.builder();

        especialidad.nombre( dto.nombre() );
        especialidad.descripcion( dto.descripcion() );

        return especialidad.build();
    }

    @Override
    public EspecialidadRespuestaDTO toDto(Especialidad entidad) {
        if ( entidad == null ) {
            return null;
        }

        Integer id = null;
        String nombre = null;
        String descripcion = null;
        Integer estado = null;

        id = entidad.getId();
        nombre = entidad.getNombre();
        descripcion = entidad.getDescripcion();
        estado = entidad.getEstado();

        EspecialidadRespuestaDTO especialidadRespuestaDTO = new EspecialidadRespuestaDTO( id, nombre, descripcion, estado );

        return especialidadRespuestaDTO;
    }

    @Override
    public void updateFromDto(EspecialidadActualizarDTO dto, Especialidad entidad) {
        if ( dto == null ) {
            return;
        }

        entidad.setNombre( dto.nombre() );
        entidad.setDescripcion( dto.descripcion() );
    }
}
