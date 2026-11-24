package com.salud.consultorio.repository;

import com.salud.consultorio.model.entity.DescansoMedico;
import org.springframework.data.repository.Repository;

import java.util.Optional;

public interface IDescansoMedicoRepositorio extends Repository<DescansoMedico, Integer> {

    DescansoMedico saveAndFlush(DescansoMedico descanso);

    Optional<DescansoMedico> findByCitaMedica_Id(Integer idCita);

    boolean existsByCitaMedica_Id(Integer idCita);
}