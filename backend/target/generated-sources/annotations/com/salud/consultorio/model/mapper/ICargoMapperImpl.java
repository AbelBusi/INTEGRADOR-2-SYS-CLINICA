package com.salud.consultorio.model.mapper;

import com.salud.consultorio.dto.cargo.CargoActualizarDTO;
import com.salud.consultorio.dto.cargo.CargoCrearDTO;
import com.salud.consultorio.dto.cargo.CargoRespuestaDTO;
import com.salud.consultorio.model.entity.Cargo;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-11-04T11:30:36-0500",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.6 (Oracle Corporation)"
)
@Component
public class ICargoMapperImpl implements ICargoMapper {

    @Override
    public Cargo toEntity(CargoCrearDTO dto) {
        if ( dto == null ) {
            return null;
        }

        Cargo.CargoBuilder cargo = Cargo.builder();

        cargo.nombre( dto.nombre() );
        cargo.descripcion( dto.descripcion() );
        cargo.esPersonalMedico( dto.esPersonalMedico() );

        return cargo.build();
    }

    @Override
    public CargoRespuestaDTO toDto(Cargo entidad) {
        if ( entidad == null ) {
            return null;
        }

        Integer id = null;
        String nombre = null;
        String descripcion = null;
        boolean esPersonalMedico = false;
        Integer estado = null;

        id = entidad.getId();
        nombre = entidad.getNombre();
        descripcion = entidad.getDescripcion();
        esPersonalMedico = entidad.isEsPersonalMedico();
        estado = entidad.getEstado();

        CargoRespuestaDTO cargoRespuestaDTO = new CargoRespuestaDTO( id, nombre, descripcion, esPersonalMedico, estado );

        return cargoRespuestaDTO;
    }

    @Override
    public void updateFromDto(CargoActualizarDTO dto, Cargo entidad) {
        if ( dto == null ) {
            return;
        }

        entidad.setNombre( dto.nombre() );
        entidad.setDescripcion( dto.descripcion() );
        entidad.setEsPersonalMedico( dto.esPersonalMedico() );
    }
}
