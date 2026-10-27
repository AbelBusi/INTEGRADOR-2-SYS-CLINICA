package com.salud.consultorio.repository;

import com.salud.consultorio.model.entity.Derivacion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IDerivacionRepositorio extends JpaRepository<Derivacion, Integer> {

    List<Derivacion> findByDiagnostico_IdAndEstadoOrderByIdAsc(Integer idDiagnostico, Integer estado);

    List<Derivacion> findByDiagnostico_CitaMedica_IdAndEstadoOrderByIdAsc(Integer idCita, Integer estado);

    boolean existsByDiagnostico_IdAndEspecialidad_IdAndEstado(
            Integer idDiagnostico, Integer idEspecialidad, Integer estado);

}