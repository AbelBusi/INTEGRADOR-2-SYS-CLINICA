package com.salud.consultorio.repository;

import com.salud.consultorio.dto.paciente.PacienteDetalleLeerDTO;
import com.salud.consultorio.dto.paciente.NombrePacientesDTO;
import com.salud.consultorio.dto.paciente.PacienteLeerDTO;
import com.salud.consultorio.model.entity.Paciente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface IPacienteRepositorio extends JpaRepository<Paciente,Integer> {

    @Query("""
    SELECT new com.salud.consultorio.dto.paciente.NombrePacientesDTO(  
        p.id,
        CONCAT(pe.nombre, ' ', pe.apellidos)
    )
    FROM Paciente p
    JOIN p.persona pe
    WHERE p.estado = 1
    """)
    List<NombrePacientesDTO> listarPacientesResumen();

    boolean existsByCodigoAseguradora(String codigo);

    @Query("""
    SELECT new com.salud.consultorio.dto.paciente.PacienteLeerDTO(
        p.id,
        CONCAT(pe.nombre, ' ', pe.apellidos),
        pe.dni,
        pe.genero,
        pe.telefono,
        p.entidadAseguradora,
        p.estado
    )
    FROM Paciente p
    JOIN p.persona pe
    """)
    List<PacienteLeerDTO> leerPacientes();

    @Query("""
SELECT new com.salud.consultorio.dto.paciente.PacienteDetalleLeerDTO(
        p.id,
        new com.salud.consultorio.dto.persona.PersonaLeerDTO(
            pe.id, 
            pe.dni, 
            pe.nombre, 
            pe.apellidos, 
            pe.fechaNacimiento, 
            pe.genero, 
            pe.telefono, 
            pe.nacionalidad, 
            pe.correo
        ),
        p.entidadAseguradora,
        p.codigoAseguradora,
        p.estado
    )
    FROM Paciente p
    JOIN p.persona pe
    WHERE p.id = :id
    """)
    Optional<PacienteDetalleLeerDTO> traerPacientePorId(@Param("id") Integer id);


    @Query("SELECT p FROM Paciente p JOIN FETCH p.persona WHERE p.id= :id")
    Optional<Paciente> findAlTPacientes(@Param("id") Integer id);

    @Query("SELECT p FROM Paciente p JOIN FETCH p.persona WHERE p.id = :id")
    Optional<Paciente> findByIdConPersona(@Param("id") Integer id);

    @Query("SELECT p FROM Paciente p JOIN Usuario u ON u.persona = p.persona WHERE u.usuario = :usuario")
    Optional<Paciente> findByUsuario(@Param("usuario") String usuario);

    @Modifying
    @Query("UPDATE Paciente p SET p.estado =:estado WHERE p.id=:id" )
    void PacienteCambiarEstado(@Param("estado")Integer estado, @Param("id") Integer id);

    @Query("""
    SELECT new com.salud.consultorio.dto.paciente.PacienteLeerDTO(
        p.id,
        pe.dni,
        CONCAT(pe.nombre, ' ', pe.apellidos),
        pe.genero,
        pe.telefono,
        p.entidadAseguradora,
        p.estado
    )
    FROM Paciente p
    JOIN p.persona pe
    """)
    List<PacienteLeerDTO> leerPacientesAll();

    @Query("""
    SELECT new com.salud.consultorio.dto.paciente.PacienteLeerDTO(
        p.id,
        pe.dni,
        CONCAT(pe.nombre, ' ', pe.apellidos),
        pe.genero,
        pe.telefono,
        p.entidadAseguradora,
        p.estado
    )
    FROM Paciente p
    JOIN p.persona pe
    WHERE p.estado=1
    """)
    List<PacienteLeerDTO> leerPacientesAllActivos();

    @Query("""
    SELECT new com.salud.consultorio.dto.paciente.PacienteLeerDTO(
        p.id,
        pe.dni,
        CONCAT(pe.nombre, ' ', pe.apellidos),
        pe.genero,
        pe.telefono,
        p.entidadAseguradora,
        p.estado
    )
    FROM Paciente p
    JOIN p.persona pe
    WHERE p.estado=0
    """)
    List<PacienteLeerDTO> leerPacientesAllInactivos();
}