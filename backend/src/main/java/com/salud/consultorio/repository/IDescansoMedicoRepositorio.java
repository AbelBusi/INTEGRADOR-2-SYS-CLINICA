package com.salud.consultorio.repository;

import com.salud.consultorio.model.entity.DescansoMedico;
import org.springframework.data.repository.Repository;

import java.util.List;
import java.util.Optional;

public interface IDescansoMedicoRepositorio extends Repository<DescansoMedico, Integer> {

    DescansoMedico saveAndFlush(DescansoMedico descanso);

    Optional<DescansoMedico> findById(Integer id);

    Optional<DescansoMedico> findByCitaMedica_Id(Integer idCita);

    boolean existsByCitaMedica_Id(Integer idCita);

    List<DescansoMedico> findByUsuario_IdOrderByFechaEmisionDesc(Integer idUsuario);
}