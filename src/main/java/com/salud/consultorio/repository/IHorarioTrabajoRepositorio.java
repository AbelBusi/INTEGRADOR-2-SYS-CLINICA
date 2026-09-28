package com.salud.consultorio.repository;

import com.salud.consultorio.dto.horario.AgendaBloqueDTO;
import com.salud.consultorio.dto.horario.DisponibilidadDTO;
import com.salud.consultorio.dto.horario.HorarioTrabajoLeerDTO;
import com.salud.consultorio.model.entity.HorarioTrabajo;
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
public interface IHorarioTrabajoRepositorio extends JpaRepository<HorarioTrabajo, Integer> {

    @Query("""
    SELECT new com.salud.consultorio.dto.horario.HorarioTrabajoLeerDTO(
        h.id,
        p.id,
        CONCAT(p.nombre, ' ', p.apellidos),
        h.tipo,
        h.diaSemana,
        h.horaInicio,
        h.horaFin,
        h.estado
    )
    FROM HorarioTrabajo h
    JOIN h.persona p
    WHERE h.estado = 1
    """)
    List<HorarioTrabajoLeerDTO> leerHorariosActivos();

    @Query("""
    SELECT new com.salud.consultorio.dto.horario.HorarioTrabajoLeerDTO(
        h.id,
        p.id,
        CONCAT(p.nombre, ' ', p.apellidos),
        h.tipo,
        h.diaSemana,
        h.horaInicio,
        h.horaFin,
        h.estado
    )
    FROM HorarioTrabajo h
    JOIN h.persona p
    WHERE h.id = :id
    """)
    Optional<HorarioTrabajoLeerDTO> obtenerDetallePorId(@Param("id") Integer id);

    @Query("""
    SELECT CASE WHEN COUNT(h) > 0 THEN true ELSE false END
    FROM HorarioTrabajo h
    WHERE h.persona.id = :personaId
    AND h.diaSemana = :diaSemana
    AND h.estado = 1
    AND h.id <> :excluirId
    AND h.horaInicio < :horaFin
    AND h.horaFin > :horaInicio
    """)
    boolean existeSolapamiento(
            @Param("personaId") Integer personaId,
            @Param("diaSemana") Integer diaSemana,
            @Param("horaInicio") LocalTime horaInicio,
            @Param("horaFin") LocalTime horaFin,
            @Param("excluirId") Integer excluirId
    );

    @Modifying
    @Query("UPDATE HorarioTrabajo h SET h.estado = :estado WHERE h.id = :id")
    void cambiarEstado(@Param("estado") Integer estado, @Param("id") Integer id);

    @Query("""
    SELECT new com.salud.consultorio.dto.horario.AgendaBloqueDTO(
        h.diaSemana, h.horaInicio, h.horaFin
    )
    FROM Doctor d
    JOIN HorarioTrabajo h ON h.persona = d.persona
    WHERE d.id = :doctorId AND h.estado = 1
    """)
    List<AgendaBloqueDTO> bloquesDoctor(@Param("doctorId") Integer doctorId);

    @Query("""
    SELECT new com.salud.consultorio.dto.horario.AgendaBloqueDTO(
        h.diaSemana, h.horaInicio, h.horaFin
    )
    FROM Recepcionista r
    JOIN HorarioTrabajo h ON h.persona = r.persona
    WHERE r.id = :recepcionistaId AND h.estado = 1
    """)
    List<AgendaBloqueDTO> bloquesRecepcionista(@Param("recepcionistaId") Integer recepcionistaId);

    @Query("""
    SELECT CASE WHEN COUNT(h) > 0 THEN true ELSE false END
    FROM Doctor d
    JOIN HorarioTrabajo h ON h.persona = d.persona
    WHERE d.id = :doctorId
    AND h.estado = 1
    AND h.diaSemana = :diaSemana
    AND h.horaInicio <= :horaInicio
    AND h.horaFin >= :horaFin
    """)
    boolean doctorTrabajaEn(
            @Param("doctorId") Integer doctorId,
            @Param("diaSemana") Integer diaSemana,
            @Param("horaInicio") LocalTime horaInicio,
            @Param("horaFin") LocalTime horaFin
    );

    @Query("""
    SELECT CASE WHEN COUNT(h) > 0 THEN true ELSE false END
    FROM Recepcionista r
    JOIN HorarioTrabajo h ON h.persona = r.persona
    WHERE r.id = :recepcionistaId
    AND h.estado = 1
    AND h.diaSemana = :diaSemana
    AND h.horaInicio <= :horaInicio
    AND h.horaFin >= :horaFin
    """)
    boolean recepcionistaTrabajaEn(
            @Param("recepcionistaId") Integer recepcionistaId,
            @Param("diaSemana") Integer diaSemana,
            @Param("horaInicio") LocalTime horaInicio,
            @Param("horaFin") LocalTime horaFin
    );

    @Query("""
    SELECT new com.salud.consultorio.dto.horario.DisponibilidadDTO(
        d.id,
        CONCAT(p.nombre, ' ', p.apellidos)
    )
    FROM Doctor d
    JOIN d.persona p
    WHERE d.estado = 1
    AND (:especialidadId IS NULL OR d.especialidad.id = :especialidadId)
    AND EXISTS (
        SELECT h FROM HorarioTrabajo h
        WHERE h.persona = p
        AND h.estado = 1
        AND h.diaSemana = :diaSemana
        AND h.horaInicio <= :horaInicio
        AND h.horaFin >= :horaFin
    )
    AND NOT EXISTS (
        SELECT c FROM CitaMedica c
        WHERE c.doctor = d
        AND c.fecha = :fecha
        AND c.horaInicio < :horaFin
        AND c.horaSalida > :horaInicio
    )
    """)
    List<DisponibilidadDTO> doctoresDisponibles(
            @Param("fecha") LocalDate fecha,
            @Param("diaSemana") Integer diaSemana,
            @Param("horaInicio") LocalTime horaInicio,
            @Param("horaFin") LocalTime horaFin,
            @Param("especialidadId") Integer especialidadId
    );

    @Query("""
    SELECT new com.salud.consultorio.dto.horario.DisponibilidadDTO(
        r.id,
        CONCAT(p.nombre, ' ', p.apellidos)
    )
    FROM Recepcionista r
    JOIN r.persona p
    WHERE r.estado = 1
    AND EXISTS (
        SELECT h FROM HorarioTrabajo h
        WHERE h.persona = p
        AND h.estado = 1
        AND h.diaSemana = :diaSemana
        AND h.horaInicio <= :horaInicio
        AND h.horaFin >= :horaFin
    )
    AND NOT EXISTS (
        SELECT c FROM CitaMedica c
        WHERE c.recepcionista = r
        AND c.fecha = :fecha
        AND c.horaInicio < :horaFin
        AND c.horaSalida > :horaInicio
    )
    """)
    List<DisponibilidadDTO> recepcionistasDisponibles(
            @Param("fecha") LocalDate fecha,
            @Param("diaSemana") Integer diaSemana,
            @Param("horaInicio") LocalTime horaInicio,
            @Param("horaFin") LocalTime horaFin
    );

}
