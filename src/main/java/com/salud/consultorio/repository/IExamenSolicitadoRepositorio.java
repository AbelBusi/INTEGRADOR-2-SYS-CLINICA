package com.salud.consultorio.repository;

import com.salud.consultorio.model.entity.ExamenSolicitado;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IExamenSolicitadoRepositorio extends JpaRepository<ExamenSolicitado, Integer> {

    List<ExamenSolicitado> findByDiagnostico_IdAndEstadoOrderByIdAsc(Integer idDiagnostico, Integer estado);

    List<ExamenSolicitado> findByDiagnostico_CitaMedica_IdAndEstadoOrderByIdAsc(Integer idCita, Integer estado);

}