package com.salud.consultorio.repository;

import com.salud.consultorio.model.entity.AuditoriaHistoriaClinica;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.repository.Repository;

@org.springframework.stereotype.Repository
public interface IAuditoriaHistoriaClinicaRepositorio extends Repository<AuditoriaHistoriaClinica, Integer> {

    AuditoriaHistoriaClinica save(AuditoriaHistoriaClinica auditoria);

    @EntityGraph(attributePaths = {"usuario", "usuario.persona"})
    Page<AuditoriaHistoriaClinica> findByHistoriaClinica_IdOrderByFechaEventoDescIdDesc(Integer idHistoria, Pageable pageable);

}