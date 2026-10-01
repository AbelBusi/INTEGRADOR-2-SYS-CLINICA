package com.salud.consultorio.repository;

import com.salud.consultorio.dto.cargo.CargoRespuestaDTO;
import com.salud.consultorio.dto.paciente.PacienteLeerDTO;
import com.salud.consultorio.model.entity.Cargo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ICargoRepositorio extends JpaRepository<Cargo, Integer> {

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

}