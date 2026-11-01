package com.salud.consultorio.repository;

import com.salud.consultorio.model.entity.Tratamiento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ITratamientoRepositorio extends JpaRepository<Tratamiento, Integer> {

    List<Tratamiento> findByDiagnostico_IdAndEstadoOrderByIdAsc(Integer idDiagnostico, Integer estado);

    List<Tratamiento> findByDiagnostico_CitaMedica_IdAndEstadoOrderByIdAsc(Integer idCita, Integer estado);

    boolean existsByDiagnostico_IdAndNombreMedicamentoIgnoreCaseAndEstado(
            Integer idDiagnostico, String nombreMedicamento, Integer estado);

    Optional<Tratamiento> findByIdAndDiagnostico_IdAndEstado(Integer id, Integer idDiagnostico, Integer estado);

    boolean existsByDiagnostico_IdAndNombreMedicamentoIgnoreCaseAndEstadoAndIdNot(
            Integer idDiagnostico, String nombreMedicamento, Integer estado, Integer id);

}