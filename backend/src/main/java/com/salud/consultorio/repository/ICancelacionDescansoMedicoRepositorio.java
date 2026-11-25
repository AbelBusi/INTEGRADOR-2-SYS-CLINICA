package com.salud.consultorio.repository;

import com.salud.consultorio.model.entity.CancelacionDescansoMedico;
import org.springframework.data.repository.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface ICancelacionDescansoMedicoRepositorio extends Repository<CancelacionDescansoMedico, Integer> {

    CancelacionDescansoMedico saveAndFlush(CancelacionDescansoMedico cancelacion);

    Optional<CancelacionDescansoMedico> findByDescansoMedico_Id(Integer idDescanso);

    List<CancelacionDescansoMedico> findByDescansoMedico_IdIn(Collection<Integer> idsDescanso);

    boolean existsByDescansoMedico_Id(Integer idDescanso);
}