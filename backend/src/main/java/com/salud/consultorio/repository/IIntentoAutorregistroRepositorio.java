package com.salud.consultorio.repository;

import com.salud.consultorio.model.entity.IntentoAutorregistro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface IIntentoAutorregistroRepositorio extends JpaRepository<IntentoAutorregistro, Integer> {

    long countByIdPersonaAndFechaIntentoAfter(Integer idPersona, LocalDateTime desde);
}