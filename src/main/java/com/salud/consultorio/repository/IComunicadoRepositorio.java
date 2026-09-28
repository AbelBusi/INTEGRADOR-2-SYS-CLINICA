package com.salud.consultorio.repository;

import com.salud.consultorio.dto.comunicado.ComunicadoLeerDTO;
import com.salud.consultorio.model.entity.Comunicado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IComunicadoRepositorio extends JpaRepository<Comunicado, Integer> {

    @Query("""
    SELECT new com.salud.consultorio.dto.comunicado.ComunicadoLeerDTO(
        c.id, c.titulo, c.mensaje, c.fecha
    )
    FROM Comunicado c
    WHERE c.estado = 1
    ORDER BY c.fecha DESC, c.id DESC
    """)
    List<ComunicadoLeerDTO> leerActivos();

}
