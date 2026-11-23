package com.salud.consultorio.repository;

import com.salud.consultorio.model.entity.AntecedentePersonal;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

@org.springframework.stereotype.Repository
public interface IAntecedentePersonalRepositorio extends Repository<AntecedentePersonal, Integer> {

    AntecedentePersonal save(AntecedentePersonal antecedente);

    Optional<AntecedentePersonal> findByIdAndHistoriaClinica_Id(Integer id, Integer idHistoria);

    @Query("""
            SELECT a FROM AntecedentePersonal a
            WHERE a.historiaClinica.id = :idHistoria AND a.estado = 1
            ORDER BY a.id
            """)
    List<AntecedentePersonal> listaActivas(@Param("idHistoria") Integer idHistoria);

}