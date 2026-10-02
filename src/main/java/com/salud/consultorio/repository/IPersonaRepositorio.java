package com.salud.consultorio.repository;

import com.salud.consultorio.model.entity.Persona;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IPersonaRepositorio extends JpaRepository<Persona, Integer> {

    boolean existsByNumeroDocumento(String numeroDocumento);

    boolean existsByCorreo(String correo);

    boolean existsByNumeroDocumentoAndIdNot(String numeroDocumento, Integer id);

    boolean existsByTelefonoAndIdNot(String telefono, Integer id);

    boolean existsByCorreoAndIdNot(String correo, Integer id);

}