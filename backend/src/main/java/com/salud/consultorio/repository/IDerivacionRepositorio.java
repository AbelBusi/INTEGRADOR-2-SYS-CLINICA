package com.salud.consultorio.repository;

import com.salud.consultorio.model.entity.Derivacion;
import com.salud.consultorio.model.entity.Diagnostico;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface IDerivacionRepositorio extends JpaRepository<Derivacion, Integer> {

    boolean existsByCodigo(String codigo);

    boolean existsByDiagnostico_IdAndEspecialidad_IdAndEstadoIn(
            Integer idDiagnostico, Integer idEspecialidad, Collection<Integer> estados);

    List<Derivacion> findByDiagnostico_IdAndEstadoInOrderByIdAsc(
            Integer idDiagnostico, Collection<Integer> estados);

    @Query("""
        select d from Derivacion d
        join fetch d.especialidad
        join fetch d.diagnostico dg
        join fetch dg.citaMedica c
        join fetch c.paciente pac
        join fetch pac.persona
        join fetch c.medico med
        join fetch med.empleado emp
        join fetch emp.persona
        where d.codigo = :codigo and d.estado in :estados
        """)
    Optional<Derivacion> buscarGestionPorCodigo(
            @Param("codigo") String codigo, @Param("estados") Collection<Integer> estados);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select d from Derivacion d where d.id = :id")
    Optional<Derivacion> bloquearPorId(@Param("id") Integer id);

    List<Derivacion> findByDiagnostico_CitaMedica_IdAndEstadoInOrderByIdAsc(
            Integer idCita, Collection<Integer> estados);

    boolean existsByDiagnostico_IdAndEspecialidad_IdAndEstadoInAndIdNot(
            Integer idDiagnostico, Integer idEspecialidad, Collection<Integer> estados, Integer id);

}