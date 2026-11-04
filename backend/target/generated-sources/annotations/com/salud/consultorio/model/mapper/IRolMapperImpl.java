package com.salud.consultorio.model.mapper;

import com.salud.consultorio.auth.dto.rol.IRolRespuestaDTO;
import com.salud.consultorio.auth.dto.rol.RolActualizarDTO;
import com.salud.consultorio.auth.dto.rol.RolCrearDTO;
import com.salud.consultorio.auth.dto.rol.RolRefDTO;
import com.salud.consultorio.auth.dto.rol.RolRespuestaDTO;
import com.salud.consultorio.model.entity.Rol;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-11-04T16:05:01-0500",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.6 (Oracle Corporation)"
)
@Component
public class IRolMapperImpl implements IRolMapper {

    @Override
    public RolRespuestaDTO toDto(Rol rol) {
        if ( rol == null ) {
            return null;
        }

        RolRespuestaDTO.RolRespuestaDTOBuilder rolRespuestaDTO = RolRespuestaDTO.builder();

        rolRespuestaDTO.id( rol.getId() );
        rolRespuestaDTO.nombre( rol.getNombre() );
        rolRespuestaDTO.descripcion( rol.getDescripcion() );
        rolRespuestaDTO.estado( rol.getEstado() );

        return rolRespuestaDTO.build();
    }

    @Override
    public Rol rolRefDtoToRol(RolRefDTO dto) {
        if ( dto == null ) {
            return null;
        }

        Rol.RolBuilder rol = Rol.builder();

        rol.id( dto.getId() );

        return rol.build();
    }

    @Override
    public Rol toEntity(RolCrearDTO entidad) {
        if ( entidad == null ) {
            return null;
        }

        Rol.RolBuilder rol = Rol.builder();

        rol.nombre( entidad.nombre() );
        rol.descripcion( entidad.descripcion() );

        return rol.build();
    }

    @Override
    public IRolRespuestaDTO toDtoRol(Rol rol) {
        if ( rol == null ) {
            return null;
        }

        Integer id = null;
        String nombre = null;
        String descripcion = null;
        Integer estado = null;

        id = rol.getId();
        nombre = rol.getNombre();
        descripcion = rol.getDescripcion();
        estado = rol.getEstado();

        IRolRespuestaDTO iRolRespuestaDTO = new IRolRespuestaDTO( id, nombre, descripcion, estado );

        return iRolRespuestaDTO;
    }

    @Override
    public void updateFromDto(RolActualizarDTO dto, Rol entidad) {
        if ( dto == null ) {
            return;
        }

        entidad.setNombre( dto.nombre() );
        entidad.setDescripcion( dto.descripcion() );
    }
}
