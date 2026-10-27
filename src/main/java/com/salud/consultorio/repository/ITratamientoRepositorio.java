package com.salud.consultorio.repository;

import com.salud.consultorio.model.entity.Tratamiento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ITratamientoRepositorio extends JpaRepository<Tratamiento, Integer> {

    List<Tratamiento> findByDiagnostico_IdAndEstadoOrderByIdAsc(Integer idDiagnostico, Integer estado);

    List<Tratamiento> findByDiagnostico_CitaMedica_IdAndEstadoOrderByIdAsc(Integer idCita, Integer estado);

    boolean existsByDiagnostico_IdAndNombreMedicamentoIgnoreCaseAndEstado(
            Integer idDiagnostico, String nombreMedicamento, Integer estado);

}