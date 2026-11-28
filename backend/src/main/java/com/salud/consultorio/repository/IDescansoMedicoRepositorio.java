package com.salud.consultorio.repository;

import com.salud.consultorio.model.entity.DescansoMedico;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface IDescansoMedicoRepositorio extends Repository<DescansoMedico, Integer> {

    DescansoMedico saveAndFlush(DescansoMedico descanso);

    Optional<DescansoMedico> findById(Integer id);

    Optional<DescansoMedico> findByCodigoDocumento(String codigoDocumento);

    List<DescansoMedico> findByUsuario_IdOrderByFechaEmisionDesc(Integer idUsuario);

    List<DescansoMedico> findByCitaMedica_IdOrderByFechaEmisionDesc(Integer idCita);

    long countByCitaMedica_Id(Integer idCita);

    /** Descansos de la atención que NO tienen cancelación (como máximo uno). */
    @Query("select d from DescansoMedico d where d.citaMedica.id = :idCita "
            + "and not exists (select 1 from CancelacionDescansoMedico c where c.descansoMedico = d) "
            + "order by d.fechaEmision desc")
    List<DescansoMedico> findVigentesByCita(@Param("idCita") Integer idCita);
}