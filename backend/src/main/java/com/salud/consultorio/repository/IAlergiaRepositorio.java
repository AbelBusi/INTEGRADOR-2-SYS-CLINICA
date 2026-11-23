package com.salud.consultorio.repository;

import com.salud.consultorio.model.entity.Alergia;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

@org.springframework.stereotype.Repository
public interface IAlergiaRepositorio extends Repository<Alergia, Integer> {

    Alergia save(Alergia alergia);

    Optional<Alergia> findByIdAndHistoriaClinica_Id(Integer id, Integer idHistoria);

    @Query("""
            SELECT a FROM Alergia a
            WHERE a.historiaClinica.id = :idHistoria AND a.estado = 1
            ORDER BY a.id
            """)
    List<Alergia> listaActivas(@Param("idHistoria") Integer idHistoria);

}