package com.salud.consultorio.repository;

import com.salud.consultorio.model.entity.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;

@org.springframework.stereotype.Repository
public interface IAtencionHistoriaRepositorio extends Repository<CitaMedica, Integer> {

    @Query(value = """
            SELECT c FROM CitaMedica c
            JOIN FETCH c.medico m
            JOIN FETCH m.empleado em
            JOIN FETCH em.persona pe
            JOIN FETCH m.especialidad es
            WHERE c.paciente.id = :idPaciente
              AND c.estado = 3
            ORDER BY c.fechaCita DESC, c.horaInicio DESC
            """,
            countQuery = """
            SELECT COUNT(c) FROM CitaMedica c
            WHERE c.paciente.id = :idPaciente AND c.estado = 3
            """)
    Page<CitaMedica> atendidasPorPaciente(@Param("idPaciente") Integer idPaciente, Pageable pageable);

    @Query("""
            SELECT d FROM Diagnostico d
            JOIN FETCH d.citaMedica c
            WHERE c.id IN :idsCita AND d.estado <> 0
            ORDER BY d.fecDiagnostico, d.id
            """)
    List<Diagnostico> diagnosticosDeCitas(@Param("idsCita") Collection<Integer> idsCita);

    @Query("""
            SELECT t FROM Tratamiento t
            JOIN FETCH t.diagnostico d
            WHERE d.id IN :idsDiagnostico AND t.estado <> 0
            ORDER BY t.id
            """)
    List<Tratamiento> tratamientosDe(@Param("idsDiagnostico") Collection<Integer> idsDiagnostico);

    @Query("""
            SELECT i FROM Indicacion i
            JOIN FETCH i.diagnostico d
            WHERE d.id IN :idsDiagnostico AND i.estado <> 0
            ORDER BY i.id
            """)
    List<Indicacion> indicacionesDe(@Param("idsDiagnostico") Collection<Integer> idsDiagnostico);

    @Query("""
            SELECT v FROM Derivacion v
            JOIN FETCH v.diagnostico d
            JOIN FETCH v.especialidad es
            WHERE d.id IN :idsDiagnostico AND v.estado <> 0
            ORDER BY v.id
            """)
    List<Derivacion> derivacionesDe(@Param("idsDiagnostico") Collection<Integer> idsDiagnostico);

}