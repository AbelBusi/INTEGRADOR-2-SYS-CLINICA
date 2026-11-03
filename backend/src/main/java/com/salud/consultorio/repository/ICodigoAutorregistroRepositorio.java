package com.salud.consultorio.repository;

import com.salud.consultorio.model.entity.CodigoAutorregistro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface ICodigoAutorregistroRepositorio extends JpaRepository<CodigoAutorregistro, Integer> {

    Optional<CodigoAutorregistro> findFirstByPersonaIdAndUsadoFalseOrderByFechaCreacionDesc(Integer idPersona);

    long countByPersonaIdAndFechaCreacionAfter(Integer idPersona, LocalDateTime desde);

    @Modifying
    @Query("UPDATE CodigoAutorregistro c SET c.usado = true WHERE c.persona.id = :idPersona AND c.usado = false")
    void invalidarActivos(@Param("idPersona") Integer idPersona);
}