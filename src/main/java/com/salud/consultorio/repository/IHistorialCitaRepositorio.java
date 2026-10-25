package com.salud.consultorio.repository;

import com.salud.consultorio.model.entity.HistorialCita;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

import java.util.List;

@org.springframework.stereotype.Repository
public interface IHistorialCitaRepositorio extends Repository<HistorialCita, Integer> {

    HistorialCita save(HistorialCita historial);

    @Query("""
            SELECT h
            FROM HistorialCita h
            JOIN FETCH h.usuario u
            JOIN FETCH u.persona
            WHERE h.cita.id = :idCita
            ORDER BY h.fechaEvento ASC, h.id ASC
            """)
    List<HistorialCita> listaPorCita(@Param("idCita") Integer idCita);

}