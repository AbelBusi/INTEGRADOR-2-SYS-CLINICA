package com.salud.consultorio.repository;

import com.salud.consultorio.model.entity.CodigoVerificacionCorreo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ICodigoVerificacionCorreoRepositorio extends JpaRepository<CodigoVerificacionCorreo, Integer> {

    Optional<CodigoVerificacionCorreo> findFirstByUsuarioIdAndUsadoFalseOrderByFechaCreacionDesc(Integer idUsuario);

    @Modifying(clearAutomatically = true)
    @Query("update CodigoVerificacionCorreo c set c.usado = true where c.usuario.id = :idUsuario and c.usado = false")
    void invalidarActivos(@Param("idUsuario") Integer idUsuario);
}