package com.salud.consultorio.repository;

import com.salud.consultorio.model.entity.Permiso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IPermisoRepositorio extends JpaRepository<Permiso,Integer> {



}