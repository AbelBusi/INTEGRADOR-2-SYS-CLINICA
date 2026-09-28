package com.salud.consultorio.repository;

import com.salud.consultorio.dto.atencion.AtencionLeerDTO;
import com.salud.consultorio.model.entity.AtencionMedica;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IAtencionMedicaRepositorio extends JpaRepository<AtencionMedica, Integer> {

    boolean existsByCitaId(Integer citaId);

    @Query("""
    SELECT new com.salud.consultorio.dto.atencion.AtencionLeerDTO(
        a.id,
        c.id,
        a.fechaAtencion,
        CONCAT(pd.nombre, ' ', pd.apellidos),
        e.nombre,
        c.motivo,
        a.diagnostico,
        a.observaciones,
        a.tratamiento,
        a.recomendaciones
    )
    FROM AtencionMedica a
    JOIN a.cita c
    JOIN c.doctor d
    JOIN d.persona pd
    JOIN c.especialidad e
    WHERE c.paciente.id = :pacienteId
    ORDER BY a.fechaAtencion DESC, a.id DESC
    """)
    List<AtencionLeerDTO> historiaPorPaciente(@Param("pacienteId") Integer pacienteId);

    @Query("""
    SELECT new com.salud.consultorio.dto.atencion.AtencionLeerDTO(
        a.id,
        c.id,
        a.fechaAtencion,
        CONCAT(pd.nombre, ' ', pd.apellidos),
        e.nombre,
        c.motivo,
        a.diagnostico,
        a.observaciones,
        a.tratamiento,
        a.recomendaciones
    )
    FROM AtencionMedica a
    JOIN a.cita c
    JOIN c.doctor d
    JOIN d.persona pd
    JOIN c.especialidad e
    WHERE c.id = :citaId
    """)
    Optional<AtencionLeerDTO> historiaPorCita(@Param("citaId") Integer citaId);

}
