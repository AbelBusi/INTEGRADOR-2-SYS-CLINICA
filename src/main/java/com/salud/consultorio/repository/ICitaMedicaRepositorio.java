package com.salud.consultorio.repository;

import com.salud.consultorio.dto.citaMedica.CitaMedicaRespuestaDTO;
import com.salud.consultorio.model.entity.CitaMedica;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ICitaMedicaRepositorio extends JpaRepository<CitaMedica, Integer> {

    @Query("""
            SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END
            FROM CitaMedica c
            WHERE c.medico.id = :idMedico
              AND c.fechaCita = :fecha
              AND c.estado = 1
              AND c.id <> :idExcluir
              AND c.horaInicio < :horaSalida
              AND c.horaSalida > :horaInicio
            """)
    boolean existeCruceCita(
            @Param("idMedico") Integer idMedico,
            @Param("fecha") LocalDate fecha,
            @Param("horaInicio") LocalTime horaInicio,
            @Param("horaSalida") LocalTime horaSalida,
            @Param("idExcluir") Integer idExcluir
    );

    @Query("""
            SELECT new com.salud.consultorio.dto.citaMedica.CitaMedicaRespuestaDTO(
                c.id,
                pa.id,
                CONCAT(pp.nombre, ' ', pp.apellidos),
                md.id,
                CONCAT(mp.nombre, ' ', mp.apellidos),
                us.id,
                c.fechaCita,
                c.horaInicio,
                c.horaSalida,
                c.motivo,
                c.estado
            )
            FROM CitaMedica c
            JOIN c.paciente pa
            JOIN pa.persona pp
            JOIN c.medico md
            JOIN md.empleado em
            JOIN em.persona mp
            JOIN c.usuario us
            WHERE (:estado IS NULL AND c.estado <> 0) OR c.estado = :estado
            ORDER BY c.fechaCita, c.horaInicio
            """)
    List<CitaMedicaRespuestaDTO> listaPorEstado(@Param("estado") Integer estado);

    @Query("""
            SELECT new com.salud.consultorio.dto.citaMedica.CitaMedicaRespuestaDTO(
                c.id,
                pa.id,
                CONCAT(pp.nombre, ' ', pp.apellidos),
                md.id,
                CONCAT(mp.nombre, ' ', mp.apellidos),
                us.id,
                c.fechaCita,
                c.horaInicio,
                c.horaSalida,
                c.motivo,
                c.estado
            )
            FROM CitaMedica c
            JOIN c.paciente pa
            JOIN pa.persona pp
            JOIN c.medico md
            JOIN md.empleado em
            JOIN em.persona mp
            JOIN c.usuario us
            WHERE c.id = :id
              AND c.estado <> 0
            """)
    Optional<CitaMedicaRespuestaDTO> buscarDetallePorId(@Param("id") Integer id);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT c FROM CitaMedica c WHERE c.id = :id")
    Optional<CitaMedica> buscarPorIdBloqueado(@Param("id") Integer id);

    @Query("""
            SELECT new com.salud.consultorio.dto.citaMedica.CitaMedicaRespuestaDTO(
                c.id,
                pa.id,
                CONCAT(pp.nombre, ' ', pp.apellidos),
                md.id,
                CONCAT(mp.nombre, ' ', mp.apellidos),
                us.id,
                c.fechaCita,
                c.horaInicio,
                c.horaSalida,
                c.motivo,
                c.estado
            )
            FROM CitaMedica c
            JOIN c.paciente pa
            JOIN pa.persona pp
            JOIN c.medico md
            JOIN md.empleado em
            JOIN em.persona mp
            JOIN c.usuario us
            WHERE md.id = :idMedico
              AND c.estado <> 0
              AND (:estado IS NULL OR c.estado = :estado)
            ORDER BY c.fechaCita, c.horaInicio
            """)
    List<CitaMedicaRespuestaDTO> listaPorMedico(@Param("idMedico") Integer idMedico,
                                                @Param("estado") Integer estado);

    @Query("""
            SELECT new com.salud.consultorio.dto.citaMedica.CitaMedicaRespuestaDTO(
                c.id,
                pa.id,
                CONCAT(pp.nombre, ' ', pp.apellidos),
                md.id,
                CONCAT(mp.nombre, ' ', mp.apellidos),
                us.id,
                c.fechaCita,
                c.horaInicio,
                c.horaSalida,
                c.motivo,
                c.estado
            )
            FROM CitaMedica c
            JOIN c.paciente pa
            JOIN pa.persona pp
            JOIN c.medico md
            JOIN md.empleado em
            JOIN em.persona mp
            JOIN c.usuario us
            WHERE pa.id = :idPaciente
              AND c.estado <> 0
              AND (:estado IS NULL OR c.estado = :estado)
            ORDER BY c.fechaCita, c.horaInicio
            """)
    List<CitaMedicaRespuestaDTO> listaPorPaciente(@Param("idPaciente") Integer idPaciente,
                                                  @Param("estado") Integer estado);

}