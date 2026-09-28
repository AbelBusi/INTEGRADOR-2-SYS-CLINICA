package com.salud.consultorio.repository;

import com.salud.consultorio.model.entity.Rol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IRolRepositorio extends JpaRepository<Rol, Integer> {
}