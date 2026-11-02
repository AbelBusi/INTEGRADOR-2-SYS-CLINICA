package com.salud.consultorio.repository;

import com.salud.consultorio.dto.horarioAtencion.HorarioAtencionResumenDTO;
import com.salud.consultorio.dto.horarioAtencion.MedicoAgendaFiltroDTO;
import com.salud.consultorio.model.entity.HorarioAtencion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface IHorarioAtencionRepositorio extends JpaRepository<HorarioAtencion, Integer> {

    @Query("""
                SELECT CASE WHEN COUNT(h) > 0 THEN true ELSE false END
                FROM HorarioAtencion h
                WHERE h.empleado.id = :idEmpleado
                  AND h.diaSemana = :diaSemana
                  AND h.estado <> 0
                  AND h.id <> :idExcluir
                  AND h.horaEntrada < :horaSalida
                  AND h.horaSalida > :horaEntrada
                  AND h.fechaInicio <= :fechaFin
                  AND h.fechaFin >= :fechaInicio
            """)
    boolean existeCruceHorario(
            @Param("idEmpleado") Integer idEmpleado,
            @Param("diaSemana") Integer diaSemana,
            @Param("horaEntrada") LocalTime horaEntrada,
            @Param("horaSalida") LocalTime horaSalida,
            @Param("fechaInicio") LocalDate fechaInicio,
            @Param("fechaFin") LocalDate fechaFin,
            @Param("idExcluir") Integer idExcluir
    );

    @Query("""
                SELECT h
                FROM HorarioAtencion h
                WHERE h.empleado.id = :idEmpleado
                  AND h.estado <> 0
                ORDER BY h.diaSemana, h.horaEntrada, h.fechaInicio
            """)
    List<HorarioAtencion> obtenerHorariosPorEmpleado(@Param("idEmpleado") Integer idEmpleado);

    @Query("""
            SELECT new com.salud.consultorio.dto.horarioAtencion.HorarioAtencionResumenDTO(
                h.id,
                h.empleado.id,
                CONCAT(h.empleado.persona.nombre, ' ', h.empleado.persona.apellidos),
                h.empleado.foto,
                h.diaSemana,
                h.horaEntrada,
                h.horaSalida,
                h.fechaInicio,
                h.fechaFin,
                h.estado
            )
            FROM HorarioAtencion h
            WHERE h.estado <> 0
              AND h.empleado.estado = 1
              AND h.empleado.persona.estado = 1
              AND EXISTS (
                  SELECT m.id
                  FROM Medico m
                  WHERE m.empleado.id = h.empleado.id
                    AND m.estado = 1
              )
            ORDER BY h.diaSemana, h.horaEntrada
            """)
    List<HorarioAtencionResumenDTO> obtenerTodosLosHorarios();

    @Query("""
            SELECT CASE WHEN COUNT(h) > 0 THEN true ELSE false END
            FROM HorarioAtencion h
            WHERE h.empleado.id = :idEmpleado
              AND h.diaSemana = :diaSemana
              AND h.estado = 1
              AND h.horaEntrada <= :horaInicio
              AND h.horaSalida >= :horaSalida
              AND h.fechaInicio <= :fecha
              AND h.fechaFin >= :fecha
            """)
    boolean existeHorarioDisponible(
            @Param("idEmpleado") Integer idEmpleado,
            @Param("diaSemana") Integer diaSemana,
            @Param("horaInicio") LocalTime horaInicio,
            @Param("horaSalida") LocalTime horaSalida,
            @Param("fecha") LocalDate fecha
    );


    @Query("""
        SELECT new com.salud.consultorio.dto.horarioAtencion.MedicoAgendaFiltroDTO(
            em.id,
            CONCAT(pe.nombre, ' ', pe.apellidos),
            ca.id,
            ca.nombre
        )
        FROM Medico m
        JOIN m.empleado em
        JOIN em.persona pe
        JOIN em.cargo ca
        WHERE m.estado = 1
          AND em.estado = 1
          AND pe.estado = 1
          AND ca.esPersonalMedico = true
        ORDER BY pe.apellidos, pe.nombre
        """)
    List<MedicoAgendaFiltroDTO> listarMedicosActivos();

    @Query("""
        SELECT CASE WHEN COUNT(m) > 0 THEN true ELSE false END
        FROM Medico m
        JOIN m.empleado em
        JOIN em.persona pe
        JOIN em.cargo ca
        WHERE em.id = :idEmpleado
          AND m.estado = 1
          AND em.estado = 1
          AND pe.estado = 1
          AND ca.esPersonalMedico = true
        """)
    boolean esMedicoActivo(@Param("idEmpleado") Integer idEmpleado);

}