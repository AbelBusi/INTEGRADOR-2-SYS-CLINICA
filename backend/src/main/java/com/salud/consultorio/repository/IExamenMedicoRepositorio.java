package com.salud.consultorio.repository;

import com.salud.consultorio.dto.examenMedico.ExamenMedicoBusquedaDTO;
import com.salud.consultorio.dto.examenMedico.ExamenMedicoRespuestaDTO;
import com.salud.consultorio.model.entity.ExamenMedico;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IExamenMedicoRepositorio extends JpaRepository<ExamenMedico, Integer> {

    boolean existsByNombreIgnoreCase(String nombre);

    boolean existsByNombreIgnoreCaseAndIdNot(String nombre, Integer id);

    @Modifying
    @Query("UPDATE ExamenMedico e SET e.estado = 2 WHERE e.id = :id")
    void desactivarLogicamente(@Param("id") Integer id);

    @Modifying
    @Query("UPDATE ExamenMedico e SET e.estado = 1 WHERE e.id = :id")
    void activarLogicamente(@Param("id") Integer id);

    @Query("""
            SELECT new com.salud.consultorio.dto.examenMedico.ExamenMedicoRespuestaDTO(
                e.id,
                e.nombre,
                e.tipoExamen,
                e.descripcion,
                e.estado
                )
            FROM ExamenMedico e
            WHERE e.estado = :estado
            ORDER BY e.nombre ASC
            """)
    List<ExamenMedicoRespuestaDTO> listaPorEstado(@Param("estado") Integer estado);

    @Query("""
            SELECT new com.salud.consultorio.dto.examenMedico.ExamenMedicoRespuestaDTO(
                e.id,
                e.nombre,
                e.tipoExamen,
                e.descripcion,
                e.estado
                )
            FROM ExamenMedico e
            WHERE e.estado = 1 OR e.estado = 2
            ORDER BY e.nombre ASC
            """)
    List<ExamenMedicoRespuestaDTO> listaPorEstadoActivoInactivo();

    @Query("""
            SELECT new com.salud.consultorio.dto.examenMedico.ExamenMedicoBusquedaDTO(
                e.id,
                e.nombre,
                e.tipoExamen
                )
            FROM ExamenMedico e
            WHERE e.estado = 1
              AND LOWER(e.nombre) LIKE LOWER(CONCAT('%', :busqueda, '%')) ESCAPE '\\'
            ORDER BY e.nombre ASC
            """)
    List<ExamenMedicoBusquedaDTO> buscarPorNombre(@Param("busqueda") String busqueda, Pageable pageable);

    @Query("""
            SELECT new com.salud.consultorio.dto.examenMedico.ExamenMedicoBusquedaDTO(
                e.id,
                e.nombre,
                e.tipoExamen
                )
            FROM ExamenMedico e
            WHERE e.estado = 1
            ORDER BY e.nombre ASC
            """)
    List<ExamenMedicoBusquedaDTO> listaResumen();
}