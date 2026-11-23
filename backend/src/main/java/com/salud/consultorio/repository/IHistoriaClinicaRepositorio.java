package com.salud.consultorio.repository;

import com.salud.consultorio.dto.historiaClinica.HistoriaClinicaResumenDTO;
import com.salud.consultorio.model.entity.HistoriaClinica;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

@org.springframework.stereotype.Repository
public interface IHistoriaClinicaRepositorio extends Repository<HistoriaClinica, Integer> {

    HistoriaClinica save(HistoriaClinica historia);

    Optional<HistoriaClinica> findById(Integer id);

    Optional<HistoriaClinica> findByPaciente_Id(Integer idPaciente);

    boolean existsByPaciente_Id(Integer idPaciente);

    @Query("""
            SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END
            FROM CitaMedica c
            WHERE c.medico.id = :idMedico
              AND c.paciente.id = :idPaciente
              AND c.estado IN (1, 3)
            """)
    boolean existeRelacionAsistencial(@Param("idMedico") Integer idMedico,
                                      @Param("idPaciente") Integer idPaciente);

    @Query("""
    select new com.salud.consultorio.dto.historiaClinica.HistoriaClinicaResumenDTO(
        h.id,
        h.numeroHistoria,
        p.id,
        concat(p.persona.nombre, ' ', p.persona.apellidos),
        p.persona.numeroDocumento,
        h.grupoSanguineo,
        h.factorRh,
        h.fechaCreacion,
        h.fechaActualizacion
    )
    from HistoriaClinica h
    join h.paciente p
    where h.estado = 1
    order by coalesce(h.fechaActualizacion, h.fechaCreacion) desc
    """)
    List<HistoriaClinicaResumenDTO> listarHistoriasClinicas();
}