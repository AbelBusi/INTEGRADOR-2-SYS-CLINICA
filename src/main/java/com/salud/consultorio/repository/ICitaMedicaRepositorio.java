package com.salud.consultorio.repository;

import com.salud.consultorio.dto.citaMedica.CitaMedicaLeerDTO;
import com.salud.consultorio.dto.citaMedica.DoctorCitaAtendidaDTO;
import com.salud.consultorio.dto.citaMedica.DoctorCitaDTO;
import com.salud.consultorio.dto.citaMedica.PacienteCitaDTO;
import com.salud.consultorio.dto.doctor.DoctorEspecialidadLeerDTO;
import com.salud.consultorio.dto.horario.AgendaCitaDTO;
import com.salud.consultorio.model.entity.CitaMedica;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ICitaMedicaRepositorio extends JpaRepository<CitaMedica,Integer> {

    @Query("""
    SELECT NEW com.salud.consultorio.dto.citaMedica.CitaMedicaLeerDTO(
           c.id, 
           p.nombre,
           p.apellidos,
           c.motivo,
           e.nombre,
           c.fecha,
           c.horaInicio,
           c.horaSalida,
           pd.nombre,
           c.estado    
    )
    FROM CitaMedica c
    JOIN c.especialidad e
    JOIN c.paciente pa
    JOIN pa.persona p
    JOIN c.doctor d
    JOIN d.persona pd
    """)
    List<CitaMedicaLeerDTO> leerCitasMedicas();

    @Query("""
    SELECT NEW com.salud.consultorio.dto.citaMedica.CitaMedicaLeerDTO(
           c.id, 
           p.nombre,
           p.apellidos,
           c.motivo,
           e.nombre,
           c.fecha,
           c.horaInicio,
           c.horaSalida,
           pd.nombre,
           c.estado    
    )
    FROM CitaMedica c
    JOIN c.especialidad e
    JOIN c.paciente pa
    JOIN pa.persona p
    JOIN c.doctor d
    JOIN d.persona pd
    WHERE c.estado=1
    """)
    List<CitaMedicaLeerDTO> leerCitasMedicasActivas();

    @Query("""
    SELECT NEW com.salud.consultorio.dto.citaMedica.CitaMedicaLeerDTO(
           c.id, 
           p.nombre,
           p.apellidos,
           c.motivo,
           e.nombre,
           c.fecha,
           c.horaInicio,
           c.horaSalida,
           pd.nombre,
           c.estado    
    )
    FROM CitaMedica c
    JOIN c.especialidad e
    JOIN c.paciente pa
    JOIN pa.persona p
    JOIN c.doctor d
    JOIN d.persona pd
    WHERE c.estado=0
    """)
    List<CitaMedicaLeerDTO> leerCitasMedicasInactivas();

    @Query("""
    SELECT new com.salud.consultorio.dto.doctor.DoctorEspecialidadLeerDTO(
        d.id,
        d.cpm,
        p.nombre,
        p.apellidos,
        e.nombre,
        p.genero,
        d.estado    
    )
    FROM Doctor d
    JOIN d.persona p
    JOIN d.especialidad e
    """)
    List<DoctorEspecialidadLeerDTO> todosDoctoresEspecialidades();

    @Query("""
    SELECT NEW com.salud.consultorio.dto.citaMedica.CitaMedicaLeerDTO(
           c.id, 
           p.nombre,
           p.apellidos,
           c.motivo,
           e.nombre,
           c.fecha,
           c.horaInicio,
           c.horaSalida,
           pd.nombre,
           c.estado    
    )
    FROM CitaMedica c
    JOIN c.especialidad e
    JOIN c.paciente pa
    JOIN pa.persona p
    JOIN c.doctor d
    JOIN d.persona pd
    WHERE c.id = :id
    """)
    Optional<CitaMedicaLeerDTO> traerCitaMedicaId(@Param("id") Integer id);

    @Query("""
    SELECT NEW com.salud.consultorio.dto.citaMedica.CitaMedicaLeerDTO(
           c.id,
           p.nombre,
           p.apellidos,
           c.motivo,
           e.nombre,
           c.fecha,
           c.horaInicio,
           c.horaSalida,
           pd.nombre,
           c.estado
    )
    FROM CitaMedica c
    JOIN c.especialidad e
    JOIN c.paciente pa
    JOIN pa.persona p
    JOIN c.doctor d
    JOIN d.persona pd
    WHERE c.recepcionista.id = :recepcionistaId
    """)
    List<CitaMedicaLeerDTO> leerCitasPorRecepcionista(@Param("recepcionistaId") Integer recepcionistaId);

    @Query("""
    SELECT new com.salud.consultorio.dto.citaMedica.DoctorCitaDTO(
        c.id,
        pa.id,
        pe.dni,
        CONCAT(pe.nombre, ' ', pe.apellidos),
        c.motivo,
        e.nombre,
        c.fecha,
        c.horaInicio,
        c.horaSalida,
        c.estado
    )
    FROM CitaMedica c
    JOIN c.doctor d
    JOIN d.persona pd
    JOIN Usuario u ON u.persona = pd
    JOIN c.paciente pa
    JOIN pa.persona pe
    JOIN c.especialidad e
    WHERE u.usuario = :usuario AND c.estado = :estado
    ORDER BY c.fecha DESC, c.horaInicio DESC
    """)
    List<DoctorCitaDTO> citasDoctorPorUsuarioYEstado(@Param("usuario") String usuario, @Param("estado") Integer estado);

    @Query("""
    SELECT DISTINCT new com.salud.consultorio.dto.doctor.PacienteDoctorDTO(
        pa.id, pe.dni, pe.nombre, pe.apellidos
    )
    FROM CitaMedica c
    JOIN c.doctor d
    JOIN d.persona pd
    JOIN Usuario u ON u.persona = pd
    JOIN c.paciente pa
    JOIN pa.persona pe
    WHERE u.usuario = :usuario AND c.estado = :estado
    """)
    List<com.salud.consultorio.dto.doctor.PacienteDoctorDTO> pacientesDoctorPorUsuarioYEstado(@Param("usuario") String usuario, @Param("estado") Integer estado);

    @Query("""
    SELECT new com.salud.consultorio.dto.citaMedica.PacienteCitaDTO(
        c.id,
        CONCAT(pd.nombre, ' ', pd.apellidos),
        e.nombre,
        c.fecha,
        c.horaInicio,
        c.horaSalida,
        c.estado,
        CONCAT(pr.nombre, ' ', pr.apellidos)
    )
    FROM CitaMedica c
    JOIN c.paciente pa
    JOIN pa.persona pp
    JOIN Usuario u ON u.persona = pp
    JOIN c.doctor d
    JOIN d.persona pd
    JOIN c.especialidad e
    JOIN c.recepcionista r
    JOIN r.persona pr
    WHERE u.usuario = :usuario
    ORDER BY c.fecha DESC, c.horaInicio DESC
    """)
    List<PacienteCitaDTO> citasPacientePorUsuario(@Param("usuario") String usuario);

    @Modifying
    @Query("UPDATE CitaMedica c SET c.estado =:estado WHERE c.id=:id" )
    void CitaCambiarEstado(@Param("estado")Integer estado, @Param("id") Integer id);

    @Query("""
    SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END
    FROM CitaMedica c
    WHERE c.fecha = :fechaCita
    AND c.doctor.id = :doctorId
    AND c.horaInicio < :nuevaHoraSalida
    AND c.horaSalida > :nuevaHoraEntrada
""")
    boolean cruceHorasCitas(
            @Param("fechaCita") LocalDate fecha,
            @Param("doctorId") Integer doctorId,
            @Param("nuevaHoraSalida") LocalTime horaSalida,
            @Param("nuevaHoraEntrada") LocalTime horaEntrada
    );

    @Query("""
    SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END
    FROM CitaMedica c
    WHERE c.fecha = :fechaCita
    AND c.recepcionista.id = :recepcionistaId
    AND c.horaInicio < :nuevaHoraSalida
    AND c.horaSalida > :nuevaHoraEntrada
""")
    boolean cruceHorasCitasRecepcionista(
            @Param("fechaCita") LocalDate fecha,
            @Param("recepcionistaId") Integer recepcionistaId,
            @Param("nuevaHoraSalida") LocalTime horaSalida,
            @Param("nuevaHoraEntrada") LocalTime horaEntrada
    );

    @Query("""
    SELECT new com.salud.consultorio.dto.horario.AgendaCitaDTO(
        c.fecha, c.horaInicio, c.horaSalida, CONCAT(pp.nombre, ' ', pp.apellidos)
    )
    FROM CitaMedica c
    JOIN c.paciente pa
    JOIN pa.persona pp
    WHERE c.doctor.id = :doctorId
    AND c.fecha BETWEEN :desde AND :hasta
    """)
    List<AgendaCitaDTO> citasDoctorRango(
            @Param("doctorId") Integer doctorId,
            @Param("desde") LocalDate desde,
            @Param("hasta") LocalDate hasta
    );

    @Query("""
    SELECT new com.salud.consultorio.dto.horario.AgendaCitaDTO(
        c.fecha, c.horaInicio, c.horaSalida, CONCAT(pp.nombre, ' ', pp.apellidos)
    )
    FROM CitaMedica c
    JOIN c.paciente pa
    JOIN pa.persona pp
    WHERE c.recepcionista.id = :recepcionistaId
    AND c.fecha BETWEEN :desde AND :hasta
    """)
    List<AgendaCitaDTO> citasRecepcionistaRango(
            @Param("recepcionistaId") Integer recepcionistaId,
            @Param("desde") LocalDate desde,
            @Param("hasta") LocalDate hasta
    );

    @Query("""
        SELECT new com.salud.consultorio.dto.citaMedica.DoctorCitaAtendidaDTO(
               c.id,
               pe.dni,
               CONCAT(pe.nombre, ' ', pe.apellidos),
               c.motivo,
               e.nombre,
               c.fecha,
               c.horaInicio,
               c.horaSalida,
               c.estado
        )
        FROM CitaMedica c
            INNER JOIN c.doctor d
            INNER JOIN d.persona p
            INNER JOIN Usuario u ON u.persona.id = p.id
            INNER JOIN c.paciente pa
            INNER JOIN pa.persona pe
            INNER JOIN c.especialidad e
        WHERE u.id = :idUsuario
        AND c.estado = :idEstado
    """)
    List<DoctorCitaAtendidaDTO> listarCitasAtendidasPorDoctor(
            @Param("idUsuario") Integer idUsuario,
            @Param("idEstado") Integer idEstado
    );

    @Query("""
        SELECT new com.salud.consultorio.dto.citaMedica.DoctorCitaAtendidaDTO(
               c.id,
               pe.dni,
               CONCAT(pe.nombre, ' ', pe.apellidos),
               c.motivo,
               e.nombre,
               c.fecha,
               c.horaInicio,
               c.horaSalida,
               c.estado
        )
        FROM CitaMedica c
            INNER JOIN c.doctor d
            INNER JOIN d.persona p
            INNER JOIN Usuario u ON u.persona.id = p.id
            INNER JOIN c.paciente pa
            INNER JOIN pa.persona pe
            INNER JOIN c.especialidad e
        WHERE u.id = :idUsuario
    """)
    List<DoctorCitaAtendidaDTO> listarCitasAtendidasPorDoctorHistorial(
            @Param("idUsuario") Integer idUsuario);

}