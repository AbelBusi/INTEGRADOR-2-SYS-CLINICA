package com.salud.consultorio.repository;

import com.salud.consultorio.model.entity.CodigoRecuperacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ICodigoRecuperacionRepositorio extends JpaRepository<CodigoRecuperacion, Integer> {

    Optional<CodigoRecuperacion> findFirstByUsuarioIdAndUsadoFalseOrderByFechaCreacionDesc(Integer idUsuario);

    @Modifying
    @Query("update CodigoRecuperacion c set c.usado = true where c.usuario.id = :idUsuario and c.usado = false")
    void invalidarActivos(@Param("idUsuario") Integer idUsuario);
}