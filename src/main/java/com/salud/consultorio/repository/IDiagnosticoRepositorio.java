package com.salud.consultorio.repository;

import com.salud.consultorio.model.entity.Diagnostico;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface IDiagnosticoRepositorio extends JpaRepository<Diagnostico, Integer> {

    Optional<Diagnostico> findByIdAndEstado(Integer id, Integer estado);

    List<Diagnostico> findByCitaMedica_IdAndEstadoOrderByFecDiagnosticoAscIdAsc(Integer idCita, Integer estado);

    boolean existsByCitaMedica_IdAndCodigoIgnoreCaseAndEstado(Integer idCita, String codigo, Integer estado);

}