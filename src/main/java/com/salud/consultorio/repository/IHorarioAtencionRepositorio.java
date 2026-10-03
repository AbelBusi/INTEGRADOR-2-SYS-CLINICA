package com.salud.consultorio.repository;

import com.salud.consultorio.model.entity.HorarioAtencion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

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
                  AND h.horaEntrada < :horaSalida
                  AND h.horaSalida > :horaEntrada
            """)
    boolean existeCruceHorario(
            Integer idEmpleado,
            Integer diaSemana,
            LocalTime horaEntrada,
            LocalTime horaSalida
    );

    @Query("""
                SELECT h
                FROM HorarioAtencion h
                WHERE h.empleado.id = :idEmpleado
                  AND h.estado <> 0
                ORDER BY h.diaSemana, h.horaEntrada
            """)
    List<HorarioAtencion> obtenerHorariosPorEmpleado(Integer idEmpleado);

}