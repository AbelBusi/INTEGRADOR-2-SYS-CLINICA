package com.salud.consultorio.repository;

import com.salud.consultorio.model.entity.Medicamento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IMedicamentoRepositorio extends JpaRepository<Medicamento, Integer> {

    List<Medicamento> findByEstadoOrderByNombreAsc(Integer estado);

    List<Medicamento> findByEstadoNotOrderByNombreAsc(Integer estado);

    boolean existsByNombreNormalizadoAndConcentracionNormalizadaAndEstadoNot(
            String nombreNormalizado,
            String concentracionNormalizada,
            Integer estado);

    boolean existsByNombreNormalizadoAndConcentracionNormalizadaAndEstadoNotAndIdNot(
            String nombreNormalizado,
            String concentracionNormalizada,
            Integer estado,
            Integer id);
}