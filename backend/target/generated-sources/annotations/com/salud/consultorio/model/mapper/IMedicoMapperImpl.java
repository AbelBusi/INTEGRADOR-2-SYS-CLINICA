package com.salud.consultorio.model.mapper;

import com.salud.consultorio.dto.medico.MedicoActualizarDTO;
import com.salud.consultorio.dto.medico.MedicoCrearDTO;
import com.salud.consultorio.dto.medico.MedicoRespuestaDTO;
import com.salud.consultorio.model.entity.Empleado;
import com.salud.consultorio.model.entity.Especialidad;
import com.salud.consultorio.model.entity.Medico;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-11-02T14:44:01-0500",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.6 (Oracle Corporation)"
)
@Component
public class IMedicoMapperImpl implements IMedicoMapper {

    @Override
    public Medico toEntity(MedicoCrearDTO dto) {
        if ( dto == null ) {
            return null;
        }

        Medico.MedicoBuilder medico = Medico.builder();

        medico.numeroColegiatura( dto.numeroColegiatura() );
        medico.numeroEspecialidad( dto.numeroEspecialidad() );
        medico.consejoRegional( dto.consejoRegional() );

        return medico.build();
    }

    @Override
    public MedicoRespuestaDTO toDto(Medico medico) {
        if ( medico == null ) {
            return null;
        }

        Integer idEmpleado = null;
        Integer idEspecialidad = null;
        String especialidad = null;
        Integer id = null;
        String numeroColegiatura = null;
        String numeroEspecialidad = null;
        String consejoRegional = null;
        Integer estado = null;

        idEmpleado = medicoEmpleadoId( medico );
        idEspecialidad = medicoEspecialidadId( medico );
        especialidad = medicoEspecialidadNombre( medico );
        id = medico.getId();
        numeroColegiatura = medico.getNumeroColegiatura();
        numeroEspecialidad = medico.getNumeroEspecialidad();
        consejoRegional = medico.getConsejoRegional();
        estado = medico.getEstado();

        MedicoRespuestaDTO medicoRespuestaDTO = new MedicoRespuestaDTO( id, idEmpleado, idEspecialidad, especialidad, numeroColegiatura, numeroEspecialidad, consejoRegional, estado );

        return medicoRespuestaDTO;
    }

    @Override
    public void updateFromDto(MedicoActualizarDTO dto, Medico medico) {
        if ( dto == null ) {
            return;
        }

        medico.setNumeroColegiatura( dto.numeroColegiatura() );
        medico.setNumeroEspecialidad( dto.numeroEspecialidad() );
        medico.setConsejoRegional( dto.consejoRegional() );
    }

    private Integer medicoEmpleadoId(Medico medico) {
        Empleado empleado = medico.getEmpleado();
        if ( empleado == null ) {
            return null;
        }
        return empleado.getId();
    }

    private Integer medicoEspecialidadId(Medico medico) {
        Especialidad especialidad = medico.getEspecialidad();
        if ( especialidad == null ) {
            return null;
        }
        return especialidad.getId();
    }

    private String medicoEspecialidadNombre(Medico medico) {
        Especialidad especialidad = medico.getEspecialidad();
        if ( especialidad == null ) {
            return null;
        }
        return especialidad.getNombre();
    }
}
