package com.salud.consultorio.repository;

import com.salud.consultorio.auth.dto.TokenSesionDTO;
import com.salud.consultorio.model.entity.Token;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ITokenRepositorio extends JpaRepository<Token,Integer> {

    List<Token> findAllByUsuarioIdAndExpiredFalseAndRevokedFalse(Integer id);

    Optional<Token> findByToken(String jwtToken);

    @Query("""
        SELECT new com.salud.consultorio.auth.dto.TokenSesionDTO(
            t.expired,
            t.revoked,
            u.estado,
            u.requiereCambioClave
        )
        FROM Token t
        JOIN t.usuario u
        WHERE t.token = :token
        """)
    Optional<TokenSesionDTO> buscarSesion(@Param("token") String token);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("UPDATE Token t SET t.expired = true, t.revoked = true WHERE t.usuario.id IN (SELECT u.id FROM Usuario u WHERE u.rol.id = :idRol)")
    void revocarPorRol(@Param("idRol") Integer idRol);

}