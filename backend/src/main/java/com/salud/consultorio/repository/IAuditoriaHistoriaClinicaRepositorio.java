package com.salud.consultorio.repository;

import com.salud.consultorio.model.entity.AuditoriaHistoriaClinica;
import org.springframework.data.repository.Repository;

@org.springframework.stereotype.Repository
public interface IAuditoriaHistoriaClinicaRepositorio extends Repository<AuditoriaHistoriaClinica, Integer> {

    AuditoriaHistoriaClinica save(AuditoriaHistoriaClinica auditoria);

}