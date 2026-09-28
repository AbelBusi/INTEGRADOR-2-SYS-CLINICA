package com.salud.consultorio.repository;

import com.salud.consultorio.dto.recepcionista.NombreRecepcionistaDTO;
import com.salud.consultorio.dto.recepcionista.RecepcionistaDetalleLeerDTO;
import com.salud.consultorio.dto.recepcionista.RecepcionistaLeerDTO;
import com.salud.consultorio.model.entity.Recepcionista;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IRecepcionistaRepositorio extends JpaRepository<Recepcionista,Integer> {

    @Query("""
    SELECT new com.salud.consultorio.dto.recepcionista.NombreRecepcionistaDTO( 
        r.id,
        CONCAT(p.nombre, ' ', p.apellidos) AS nombreRecepcionista
    )
    FROM Recepcionista r
    JOIN r.persona p
    WHERE r.estado = 1
    """)
    List<NombreRecepcionistaDTO> listarRecepcionistasNombres();

    boolean existsByCodigoEmpleado(String nombre);

    @Query("SELECT r FROM Recepcionista r JOIN FETCH r.persona WHERE r.id = :id")
    Optional<Recepcionista> findByIdConRecepcionista(@Param("id") Integer id);

    @Query("SELECT r FROM Recepcionista r JOIN Usuario u ON u.persona = r.persona WHERE u.usuario = :usuario")
    Optional<Recepcionista> findByUsuario(@Param("usuario") String usuario);

    @Query("""
    SELECT new com.salud.consultorio.dto.recepcionista.RecepcionistaDetalleLeerDTO(
        r.id,
        new com.salud.consultorio.dto.persona.PersonaLeerDTO(
            p.id,
            p.dni,
            p.nombre,
            p.apellidos,
            p.fechaNacimiento,
            p.genero,
            p.telefono,
            p.nacionalidad,
            p.correo
        ),
        r.codigoEmpleado,
        r.estado
    )
    FROM Recepcionista r
    JOIN r.persona p
    WHERE r.id = :id
    """)
    Optional<RecepcionistaDetalleLeerDTO> obtenerDetallePorId(@Param("id") Integer id);

    @Query("""
    SELECT new com.salud.consultorio.dto.recepcionista.RecepcionistaLeerDTO(
        r.id,
        r.codigoEmpleado,
        pe.nombre,
        pe.apellidos,
        pe.genero,
        r.estado
    )
    FROM Recepcionista r
    JOIN r.persona pe
    """)
    List<RecepcionistaLeerDTO> leerRecepcionistas();


    @Query("""
    SELECT new com.salud.consultorio.dto.recepcionista.RecepcionistaLeerDTO(
        r.id,
        r.codigoEmpleado,
        pe.nombre,
        pe.apellidos,
        pe.genero,
        r.estado
    )
    FROM Recepcionista r
    JOIN r.persona pe
    WHERE r.id = :id 
    """)
    Optional<RecepcionistaLeerDTO> leerRecepcionistaPorId(@Param("id") Integer id);

    @Query("""
    SELECT new com.salud.consultorio.dto.recepcionista.RecepcionistaLeerDTO(
        r.id,
        r.codigoEmpleado,
        pe.nombre,
        pe.apellidos,
        pe.genero,
        r.estado
    )
    FROM Recepcionista r
    JOIN r.persona pe
    WHERE r.estado=1
    """)
    List<RecepcionistaLeerDTO> leerRecepcionistasActivos();

    @Query("""
    SELECT new com.salud.consultorio.dto.recepcionista.RecepcionistaLeerDTO(
        r.id,
        r.codigoEmpleado,
        pe.nombre,
        pe.apellidos,
        pe.genero,
        r.estado
    )
    FROM Recepcionista r
    JOIN r.persona pe
    WHERE r.estado=0
    """)
    List<RecepcionistaLeerDTO> leerRecepcionistasInactivos();

    @Modifying
    @Query("UPDATE Recepcionista r SET r.estado =:estado WHERE r.id=:id" )
    void RecepcionistaCambiarEstado(@Param("estado")Integer estado, @Param("id") Integer id);

}