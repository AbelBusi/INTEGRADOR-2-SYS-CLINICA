package com.salud.consultorio.repository;

import com.salud.consultorio.dto.persona.PersonaLeerDTO;
import com.salud.consultorio.model.entity.Persona;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface IPersonaRepositorio extends JpaRepository<Persona, Integer> {

    boolean existsByDni(String dni);

    boolean existsByCorreo(String correo);

    @Query("""
        SELECT new com.salud.consultorio.dto.persona.PersonaLeerDTO(
            p.id,
            p.dni,
            p.nombre,
            p.apellidos,
            p.fechaNacimiento,
            p.genero,
            p.telefono,
            p.nacionalidad,
            p.correo
        )
        FROM Persona p
        WHERE p.estado = 1
        AND p.id NOT IN (SELECT u.persona.id FROM Usuario u)
    """)
    List<PersonaLeerDTO> listarPersonasSinCuenta();

}