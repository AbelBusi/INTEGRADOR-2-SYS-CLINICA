package com.salud.consultorio.repository;

import com.salud.consultorio.dto.especialidad.EspecialidadRespuestaDTO;
import com.salud.consultorio.model.entity.Especialidad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IEspecialidadRepositorio extends JpaRepository<Especialidad, Integer> {

    boolean existsByNombre(String codigo);

    @Modifying
    @Query("UPDATE Especialidad e SET e.estado =:estado WHERE e.id=:id" )
    void EspecialidadCambiarEstado(@Param("estado")Integer estado, @Param("id") Integer id);

    @Query("""
            SELECT new com.salud.consultorio.dto.especialidad.EspecialidadRespuestaDTO(
                e.id,
                e.nombre,
                e.descripcion,
                e.estado    
                )
            FROM Especialidad e
            WHERE e.estado= :estado
            """)
    List<EspecialidadRespuestaDTO> listaPorEstado(@Param("estado") Integer estado);

    @Query("""
            SELECT new com.salud.consultorio.dto.especialidad.EspecialidadRespuestaDTO(
                e.id,
                e.nombre,
                e.descripcion,
                e.estado    
                )
            FROM Especialidad e
            WHERE e.estado=1 OR e.estado=2
            """)
    List<EspecialidadRespuestaDTO> listaPorEstadoActivoInactivo();


    boolean existsByNombreAndIdNot(String nombre, Integer id);

    @Modifying
    @Query("UPDATE Especialidad e SET e.estado =2 WHERE e.id=:id")
    void desactivarLogicamente(@Param("id") Integer id);

    @Modifying
    @Query("UPDATE Especialidad e SET e.estado =1 WHERE e.id=:id")
    void activarLogicamente(@Param("id") Integer id);

    @Modifying
    @Query("UPDATE Especialidad e SET e.estado =0 WHERE e.id=:id")
    void eliminarLogicamente(@Param("id") Integer id);

    Optional<Especialidad> findByIdAndEstado(Integer id, Integer estado);

}