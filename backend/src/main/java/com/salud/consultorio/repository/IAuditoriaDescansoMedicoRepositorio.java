package com.salud.consultorio.repository;

import com.salud.consultorio.model.entity.AuditoriaDescansoMedico;
import org.springframework.data.repository.Repository;

import java.util.List;

public interface IAuditoriaDescansoMedicoRepositorio extends Repository<AuditoriaDescansoMedico, Integer> {

    AuditoriaDescansoMedico save(AuditoriaDescansoMedico auditoria);

    List<AuditoriaDescansoMedico> findByCitaMedica_IdOrderByFechaEventoDesc(Integer idCita);
}