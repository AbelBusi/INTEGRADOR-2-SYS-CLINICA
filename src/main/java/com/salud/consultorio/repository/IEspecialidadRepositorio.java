package com.salud.consultorio.repository;

import com.salud.consultorio.dto.especialidad.EspecialidadLeerDTO;
import com.salud.consultorio.dto.especialidad.NombreEspecialidadesDTO;
import com.salud.consultorio.model.entity.Especialidad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IEspecialidadRepositorio extends JpaRepository<Especialidad, Integer> {

    @Query("""
    SELECT new com.salud.consultorio.dto.especialidad.NombreEspecialidadesDTO(
         e.id AS id,
         e.nombre
        )
        FROM Especialidad e
        WHERE e.estado=1
    """)
    List<NombreEspecialidadesDTO> listarEspecialidades();

    boolean existsByNombre(String codigo);

    @Modifying
    @Query("UPDATE Especialidad e SET e.estado =:estado WHERE e.id=:id" )
    void EspecialidadCambiarEstado(@Param("estado")Integer estado, @Param("id") Integer id);

    @Query("""
    SELECT new com.salud.consultorio.dto.especialidad.EspecialidadLeerDTO(
        e.id,
        e.nombre,
        e.descripcion,
        e.estado
    )
    FROM Especialidad e
    """)
    List<EspecialidadLeerDTO> leerEspecialidades();

    @Query("""
    SELECT new com.salud.consultorio.dto.especialidad.EspecialidadLeerDTO(
        e.id,
        e.nombre,
        e.descripcion,
        e.estado
    )
    FROM Especialidad e
    WHERE e.estado=1
    """)
    List<EspecialidadLeerDTO> leerEspecialidadesActivas();

    @Query("""
    SELECT new com.salud.consultorio.dto.especialidad.EspecialidadLeerDTO(
        e.id,
        e.nombre,
        e.descripcion,
        e.estado
    )
    FROM Especialidad e
    WHERE e.estado=0
    """)
    List<EspecialidadLeerDTO> leerEspecialidadesInactivas();

    @Query("""
    SELECT new com.salud.consultorio.dto.especialidad.EspecialidadLeerDTO(
        e.id,
        e.nombre,
        e.descripcion,
        e.estado
    )
    FROM Especialidad e
    WHERE e.id = :id
    """)
    Optional<EspecialidadLeerDTO> leerEspecialidadPorId(@Param("id") Integer id);


}