package com.salud.consultorio.repository;

import com.salud.consultorio.model.entity.Indicacion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface IIndicacionRepositorio extends JpaRepository<Indicacion, Integer> {

    List<Indicacion> findByDiagnostico_IdAndEstadoOrderByIdAsc(Integer idDiagnostico, Integer estado);

    List<Indicacion> findByDiagnostico_CitaMedica_IdAndEstadoOrderByIdAsc(Integer idCita, Integer estado);

    Optional<Indicacion> findByIdAndDiagnostico_IdAndEstado(Integer id, Integer idDiagnostico, Integer estado);

}