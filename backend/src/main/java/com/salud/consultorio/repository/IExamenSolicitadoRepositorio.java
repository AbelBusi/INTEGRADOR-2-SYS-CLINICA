package com.salud.consultorio.repository;

import com.salud.consultorio.model.entity.ExamenSolicitado;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface IExamenSolicitadoRepositorio extends JpaRepository<ExamenSolicitado, Integer> {

    List<ExamenSolicitado> findByDiagnostico_IdAndEstadoOrderByIdAsc(Integer idDiagnostico, Integer estado);

    List<ExamenSolicitado> findByDiagnostico_CitaMedica_IdAndEstadoOrderByIdAsc(Integer idCita, Integer estado);

    Optional<ExamenSolicitado> findByIdAndDiagnostico_IdAndEstado(Integer id, Integer idDiagnostico, Integer estado);

    boolean existsByDiagnostico_IdAndNombreExamenIgnoreCaseAndEstado(
            Integer idDiagnostico, String nombreExamen, Integer estado);

    boolean existsByDiagnostico_IdAndNombreExamenIgnoreCaseAndEstadoAndIdNot(
            Integer idDiagnostico, String nombreExamen, Integer estado, Integer id);

}