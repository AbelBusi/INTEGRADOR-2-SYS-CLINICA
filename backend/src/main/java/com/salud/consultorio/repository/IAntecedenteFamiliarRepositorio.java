package com.salud.consultorio.repository;

import com.salud.consultorio.model.entity.AntecedenteFamiliar;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

@org.springframework.stereotype.Repository
public interface IAntecedenteFamiliarRepositorio extends Repository<AntecedenteFamiliar, Integer> {

    AntecedenteFamiliar save(AntecedenteFamiliar antecedente);

    Optional<AntecedenteFamiliar> findByIdAndHistoriaClinica_Id(Integer id, Integer idHistoria);

    @Query("""
            SELECT a FROM AntecedenteFamiliar a
            WHERE a.historiaClinica.id = :idHistoria AND a.estado = 1
            ORDER BY a.id
            """)
    List<AntecedenteFamiliar> listaActivas(@Param("idHistoria") Integer idHistoria);

}