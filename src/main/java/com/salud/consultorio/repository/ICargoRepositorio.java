package com.salud.consultorio.repository;

import com.salud.consultorio.model.entity.Cargo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ICargoRepositorio extends JpaRepository<Cargo, Integer> {
}