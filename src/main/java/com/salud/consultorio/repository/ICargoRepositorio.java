package com.salud.consultorio.repository;

import com.salud.consultorio.dto.cargo.CargoRespuestaDTO;
import com.salud.consultorio.model.entity.Cargo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ICargoRepositorio extends JpaRepository<Cargo, Integer> {

    boolean existsByNombre(String nombre);

    @Query("""
            SELECT new com.salud.consultorio.dto.cargo.CargoRespuestaDTO(
                c.id,
                c.nombre,
                c.descripcion,
                c.estado    
                )
            FROM Cargo c
            WHERE c.estado= :estado
            """)
    List<CargoRespuestaDTO> listaPorEstado(@Param("estado") Integer estado);

    @Query("""
            SELECT new com.salud.consultorio.dto.cargo.CargoRespuestaDTO(
                c.id,
                c.nombre,
                c.descripcion,
                c.estado    
                )
            FROM Cargo c
            WHERE c.estado=1 OR c.estado=2
            """)
    List<CargoRespuestaDTO> listaPorEstadoActivoInactivo();

    @Modifying
    @Query("UPDATE Cargo c SET c.estado =2 WHERE c.id=:id")
    void desactivarLogicamente(@Param("id") Integer id);

    @Modifying
    @Query("UPDATE Cargo c SET c.estado =1 WHERE c.id=:id")
    void activarLogicamente(@Param("id") Integer id);

    @Modifying
    @Query("UPDATE Cargo c SET c.estado =0 WHERE c.id=:id")
    void eliminarLogicamente(@Param("id") Integer id);

}