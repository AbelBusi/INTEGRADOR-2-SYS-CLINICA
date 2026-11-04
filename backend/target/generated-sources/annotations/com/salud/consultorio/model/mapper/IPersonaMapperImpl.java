package com.salud.consultorio.model.mapper;

import com.salud.consultorio.dto.persona.PersonaActualizarDTO;
import com.salud.consultorio.dto.persona.PersonaCrearDTO;
import com.salud.consultorio.model.entity.Persona;
import com.salud.consultorio.model.entity.TipoDocumento;
import java.time.LocalDate;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-11-04T16:05:04-0500",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.6 (Oracle Corporation)"
)
@Component
public class IPersonaMapperImpl implements IPersonaMapper {

    @Override
    public Persona toEntity(PersonaCrearDTO personaCrearDTO, TipoDocumento tipoDocumento) {
        if ( personaCrearDTO == null && tipoDocumento == null ) {
            return null;
        }

        Persona.PersonaBuilder persona = Persona.builder();

        if ( personaCrearDTO != null ) {
            persona.numeroDocumento( personaCrearDTO.numeroDocumento() );
            persona.nombre( personaCrearDTO.nombre() );
            persona.apellidos( personaCrearDTO.apellidos() );
            persona.fechaNacimiento( personaCrearDTO.fechaNacimiento() );
            persona.genero( personaCrearDTO.genero() );
            persona.telefono( personaCrearDTO.telefono() );
            persona.direccion( personaCrearDTO.direccion() );
            persona.correo( personaCrearDTO.correo() );
            persona.nacionalidad( personaCrearDTO.nacionalidad() );
        }
        persona.tipoDocumento( tipoDocumento );

        return persona.build();
    }

    @Override
    public void updateFromDto(PersonaActualizarDTO personaActualizarDTO, Persona persona) {
        if ( personaActualizarDTO == null ) {
            return;
        }

        persona.setNumeroDocumento( personaActualizarDTO.numeroDocumento() );
        persona.setNombre( personaActualizarDTO.nombre() );
        persona.setApellidos( personaActualizarDTO.apellidos() );
        persona.setFechaNacimiento( personaActualizarDTO.fechaNacimiento() );
        persona.setGenero( personaActualizarDTO.genero() );
        persona.setTelefono( personaActualizarDTO.telefono() );
        persona.setDireccion( personaActualizarDTO.direccion() );
        persona.setCorreo( personaActualizarDTO.correo() );
        persona.setNacionalidad( personaActualizarDTO.nacionalidad() );
    }

    @Override
    public PersonaActualizarDTO toDto(Persona persona) {
        if ( persona == null ) {
            return null;
        }

        Integer tipoDocumento = null;
        String numeroDocumento = null;
        String nombre = null;
        String apellidos = null;
        LocalDate fechaNacimiento = null;
        String genero = null;
        String telefono = null;
        String direccion = null;
        String correo = null;
        String nacionalidad = null;

        tipoDocumento = personaTipoDocumentoIdTipoDocumento( persona );
        numeroDocumento = persona.getNumeroDocumento();
        nombre = persona.getNombre();
        apellidos = persona.getApellidos();
        fechaNacimiento = persona.getFechaNacimiento();
        genero = persona.getGenero();
        telefono = persona.getTelefono();
        direccion = persona.getDireccion();
        correo = persona.getCorreo();
        nacionalidad = persona.getNacionalidad();

        PersonaActualizarDTO personaActualizarDTO = new PersonaActualizarDTO( tipoDocumento, numeroDocumento, nombre, apellidos, fechaNacimiento, genero, telefono, direccion, correo, nacionalidad );

        return personaActualizarDTO;
    }

    private Integer personaTipoDocumentoIdTipoDocumento(Persona persona) {
        TipoDocumento tipoDocumento = persona.getTipoDocumento();
        if ( tipoDocumento == null ) {
            return null;
        }
        return tipoDocumento.getIdTipoDocumento();
    }
}
