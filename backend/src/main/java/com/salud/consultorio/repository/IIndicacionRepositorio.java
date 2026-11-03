package com.salud.consultorio.repository;

import com.salud.consultorio.model.entity.Indicacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface IIndicacionRepositorio extends JpaRepository<Indicacion, Integer> {

    List<Indicacion> findByDiagnostico_IdAndEstadoOrderByIdAsc(Integer idDiagnostico, Integer estado);

    List<Indicacion> findByDiagnostico_CitaMedica_IdAndEstadoOrderByIdAsc(Integer idCita, Integer estado);

    Optional<Indicacion> findByIdAndDiagnostico_IdAndEstado(Integer id, Integer idDiagnostico, Integer estado);
    @Modifying(flushAutomatically = true)
    @Query("update Indicacion t set t.estado = 0 where t.diagnostico.id = :idDiagnostico and t.estado = 1")
    int desactivarPorDiagnostico(@Param("idDiagnostico") Integer idDiagnostico);
}