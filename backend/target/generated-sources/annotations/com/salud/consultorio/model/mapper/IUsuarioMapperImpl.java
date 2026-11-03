package com.salud.consultorio.model.mapper;

import com.salud.consultorio.auth.dto.UsuarioCrearDTO;
import com.salud.consultorio.dto.persona.PersonaRefDTO;
import com.salud.consultorio.dto.usuario.UsuarioActualizarDTO;
import com.salud.consultorio.dto.usuario.UsuarioRespuestaDTO;
import com.salud.consultorio.model.entity.Persona;
import com.salud.consultorio.model.entity.Usuario;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-11-02T17:31:25-0500",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.6 (Oracle Corporation)"
)
@Component
public class IUsuarioMapperImpl implements IUsuarioMapper {

    @Override
    public Usuario toEntity(UsuarioCrearDTO dto) {
        if ( dto == null ) {
            return null;
        }

        Usuario.UsuarioBuilder usuario = Usuario.builder();

        usuario.usuario( dto.getUsuario() );

        return usuario.build();
    }

    @Override
    public UsuarioRespuestaDTO toDto(Usuario usuario) {
        if ( usuario == null ) {
            return null;
        }

        UsuarioRespuestaDTO.UsuarioRespuestaDTOBuilder usuarioRespuestaDTO = UsuarioRespuestaDTO.builder();

        usuarioRespuestaDTO.id( usuario.getId() );
        usuarioRespuestaDTO.persona( personaToPersonaRefDTO( usuario.getPersona() ) );
        usuarioRespuestaDTO.usuario( usuario.getUsuario() );
        usuarioRespuestaDTO.claveAcceso( usuario.getClaveAcceso() );
        usuarioRespuestaDTO.estado( usuario.getEstado() );

        return usuarioRespuestaDTO.build();
    }

    @Override
    public void updateFromDto(UsuarioActualizarDTO dto, Usuario usuario) {
        if ( dto == null ) {
            return;
        }

        usuario.setId( dto.getId() );
        if ( dto.getPersona() != null ) {
            if ( usuario.getPersona() == null ) {
                usuario.setPersona( Persona.builder().build() );
            }
            personaRefDTOToPersona( dto.getPersona(), usuario.getPersona() );
        }
        else {
            usuario.setPersona( null );
        }
        usuario.setUsuario( dto.getUsuario() );
        usuario.setClaveAcceso( dto.getClaveAcceso() );
        usuario.setEstado( dto.getEstado() );
    }

    protected PersonaRefDTO personaToPersonaRefDTO(Persona persona) {
        if ( persona == null ) {
            return null;
        }

        PersonaRefDTO personaRefDTO = new PersonaRefDTO();

        personaRefDTO.setId( persona.getId() );

        return personaRefDTO;
    }

    protected void personaRefDTOToPersona(PersonaRefDTO personaRefDTO, Persona mappingTarget) {
        if ( personaRefDTO == null ) {
            return;
        }

        mappingTarget.setId( personaRefDTO.getId() );
    }
}
