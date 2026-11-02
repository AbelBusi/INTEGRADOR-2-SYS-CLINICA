package com.salud.consultorio.model.mapper;

import com.salud.consultorio.dto.empleado.ConvertirPacienteEmpledo;
import com.salud.consultorio.dto.empleado.EmpleadoActualizarDTO;
import com.salud.consultorio.dto.empleado.EmpleadoCrearDTO;
import com.salud.consultorio.dto.empleado.EmpleadoRespuestaDTO;
import com.salud.consultorio.dto.empleado.PacienteConvertidoEmpleadoRespuestaDTO;
import com.salud.consultorio.model.entity.Cargo;
import com.salud.consultorio.model.entity.Empleado;
import com.salud.consultorio.model.entity.Persona;
import java.time.LocalDate;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-11-02T14:44:00-0500",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.6 (Oracle Corporation)"
)
@Component
public class IEmpleadoMapperImpl implements IEmpleadoMapper {

    @Override
    public Empleado toEntity(EmpleadoCrearDTO dto) {
        if ( dto == null ) {
            return null;
        }

        Empleado.EmpleadoBuilder empleado = Empleado.builder();

        return empleado.build();
    }

    @Override
    public Empleado toEntity(ConvertirPacienteEmpledo dto) {
        if ( dto == null ) {
            return null;
        }

        Empleado.EmpleadoBuilder empleado = Empleado.builder();

        return empleado.build();
    }

    @Override
    public EmpleadoRespuestaDTO toDto(Empleado empleado) {
        if ( empleado == null ) {
            return null;
        }

        Integer idPersona = null;
        Integer idCargo = null;
        String cargo = null;
        Integer id = null;
        LocalDate fechaIngreso = null;
        LocalDate fechaRetiro = null;
        String foto = null;
        Integer estado = null;

        idPersona = empleadoPersonaId( empleado );
        idCargo = empleadoCargoId( empleado );
        cargo = empleadoCargoNombre( empleado );
        id = empleado.getId();
        fechaIngreso = empleado.getFechaIngreso();
        fechaRetiro = empleado.getFechaRetiro();
        foto = empleado.getFoto();
        estado = empleado.getEstado();

        EmpleadoRespuestaDTO empleadoRespuestaDTO = new EmpleadoRespuestaDTO( id, idPersona, idCargo, cargo, fechaIngreso, fechaRetiro, foto, estado );

        return empleadoRespuestaDTO;
    }

    @Override
    public PacienteConvertidoEmpleadoRespuestaDTO toDtoEntity(Empleado empleado) {
        if ( empleado == null ) {
            return null;
        }

        Integer id = null;
        Integer idCargo = null;

        id = empleado.getId();
        idCargo = empleadoCargoId( empleado );

        PacienteConvertidoEmpleadoRespuestaDTO pacienteConvertidoEmpleadoRespuestaDTO = new PacienteConvertidoEmpleadoRespuestaDTO( id, idCargo );

        return pacienteConvertidoEmpleadoRespuestaDTO;
    }

    @Override
    public void updateFromDto(EmpleadoActualizarDTO dto, Empleado empleado) {
        if ( dto == null ) {
            return;
        }
    }

    private Integer empleadoPersonaId(Empleado empleado) {
        Persona persona = empleado.getPersona();
        if ( persona == null ) {
            return null;
        }
        return persona.getId();
    }

    private Integer empleadoCargoId(Empleado empleado) {
        Cargo cargo = empleado.getCargo();
        if ( cargo == null ) {
            return null;
        }
        return cargo.getId();
    }

    private String empleadoCargoNombre(Empleado empleado) {
        Cargo cargo = empleado.getCargo();
        if ( cargo == null ) {
            return null;
        }
        return cargo.getNombre();
    }
}
