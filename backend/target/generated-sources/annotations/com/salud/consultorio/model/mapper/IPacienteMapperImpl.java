package com.salud.consultorio.model.mapper;

import com.salud.consultorio.dto.paciente.EmpleadoConvertidoPacienteRespuestaDTO;
import com.salud.consultorio.dto.paciente.EmpleadoConvertirPacienteDTO;
import com.salud.consultorio.dto.paciente.PacienteActualizarDTO;
import com.salud.consultorio.dto.paciente.PacienteCrearDTO;
import com.salud.consultorio.dto.paciente.PacienteRespuestaDTO;
import com.salud.consultorio.dto.persona.PersonaRespuestaDTO;
import com.salud.consultorio.model.entity.Paciente;
import com.salud.consultorio.model.entity.Persona;
import java.time.LocalDate;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-11-02T17:31:25-0500",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.6 (Oracle Corporation)"
)
@Component
public class IPacienteMapperImpl implements IPacienteMapper {

    @Override
    public Paciente toEntity(PacienteCrearDTO pacienteCrearDTO) {
        if ( pacienteCrearDTO == null ) {
            return null;
        }

        Paciente.PacienteBuilder paciente = Paciente.builder();

        paciente.codigoAsegurado( pacienteCrearDTO.codigoAsegurado() );
        paciente.entidadAsegurado( pacienteCrearDTO.entidadAsegurado() );

        return paciente.build();
    }

    @Override
    public Paciente toEntity(EmpleadoConvertirPacienteDTO dto) {
        if ( dto == null ) {
            return null;
        }

        Paciente.PacienteBuilder paciente = Paciente.builder();

        paciente.codigoAsegurado( dto.codigoAsegurado() );
        paciente.entidadAsegurado( dto.entidadAsegurado() );

        return paciente.build();
    }

    @Override
    public PacienteRespuestaDTO toDto(Paciente paciente) {
        if ( paciente == null ) {
            return null;
        }

        Integer id = null;
        String entidadAsegurado = null;
        String codigoAsegurado = null;
        Integer estado = null;
        PersonaRespuestaDTO persona = null;

        id = paciente.getId();
        entidadAsegurado = paciente.getEntidadAsegurado();
        codigoAsegurado = paciente.getCodigoAsegurado();
        estado = paciente.getEstado();
        persona = personaToPersonaRespuestaDTO( paciente.getPersona() );

        PacienteRespuestaDTO pacienteRespuestaDTO = new PacienteRespuestaDTO( id, entidadAsegurado, codigoAsegurado, estado, persona );

        return pacienteRespuestaDTO;
    }

    @Override
    public EmpleadoConvertidoPacienteRespuestaDTO toDtoEntity(Paciente entidad) {
        if ( entidad == null ) {
            return null;
        }

        Integer id = null;
        String entidadAsegurado = null;
        String codigoAsegurado = null;
        Integer estado = null;

        id = entidad.getId();
        entidadAsegurado = entidad.getEntidadAsegurado();
        codigoAsegurado = entidad.getCodigoAsegurado();
        estado = entidad.getEstado();

        EmpleadoConvertidoPacienteRespuestaDTO empleadoConvertidoPacienteRespuestaDTO = new EmpleadoConvertidoPacienteRespuestaDTO( id, entidadAsegurado, codigoAsegurado, estado );

        return empleadoConvertidoPacienteRespuestaDTO;
    }

    @Override
    public void updateFromDto(PacienteActualizarDTO actualizarDTO, Paciente paciente) {
        if ( actualizarDTO == null ) {
            return;
        }

        paciente.setCodigoAsegurado( actualizarDTO.codigoAsegurado() );
    }

    protected PersonaRespuestaDTO personaToPersonaRespuestaDTO(Persona persona) {
        if ( persona == null ) {
            return null;
        }

        Integer id = null;
        String numeroDocumento = null;
        String nombre = null;
        String apellidos = null;
        LocalDate fechaNacimiento = null;
        String genero = null;
        String telefono = null;
        String nacionalidad = null;
        String correo = null;
        Integer estado = null;

        id = persona.getId();
        numeroDocumento = persona.getNumeroDocumento();
        nombre = persona.getNombre();
        apellidos = persona.getApellidos();
        fechaNacimiento = persona.getFechaNacimiento();
        genero = persona.getGenero();
        telefono = persona.getTelefono();
        nacionalidad = persona.getNacionalidad();
        correo = persona.getCorreo();
        estado = persona.getEstado();

        PersonaRespuestaDTO personaRespuestaDTO = new PersonaRespuestaDTO( id, numeroDocumento, nombre, apellidos, fechaNacimiento, genero, telefono, nacionalidad, correo, estado );

        return personaRespuestaDTO;
    }
}
