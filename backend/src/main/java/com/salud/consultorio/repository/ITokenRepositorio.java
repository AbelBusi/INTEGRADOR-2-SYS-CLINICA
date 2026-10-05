package com.salud.consultorio.repository;

import com.salud.consultorio.model.entity.Token;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ITokenRepositorio extends JpaRepository<Token,Integer> {

    List<Token> findAllByUsuarioIdAndExpiredFalseAndRevokedFalse(Integer id);

    Optional<Token> findByToken(String jwtToken);

}