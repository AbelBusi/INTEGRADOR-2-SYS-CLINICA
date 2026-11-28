package com.salud.consultorio.repository;

import com.salud.consultorio.model.entity.Medicamento;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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

    @Query("""
            SELECT m FROM Medicamento m
            WHERE m.estado = :estado
              AND (m.nombreNormalizado LIKE CONCAT('%', :texto, '%')
                   OR LOWER(m.principioActivo) LIKE CONCAT('%', :texto, '%'))
            ORDER BY CASE WHEN m.nombreNormalizado LIKE CONCAT(:texto, '%') THEN 0 ELSE 1 END,
                     m.nombre ASC
            """)
    List<Medicamento> buscarPorTexto(@Param("texto") String texto,
                                     @Param("estado") Integer estado,
                                     Pageable pageable);
}