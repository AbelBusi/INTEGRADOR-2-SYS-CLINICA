package com.salud.consultorio.repository;

import com.salud.consultorio.dto.doctor.DoctorEspecialidadLeerDTO;
import com.salud.consultorio.dto.usuario.UsuarioDetalleLeerDTO;
import com.salud.consultorio.dto.usuario.UsuarioListaDTO;
import com.salud.consultorio.dto.usuario.UsuarioRolDTO;
import com.salud.consultorio.model.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface IUsuarioRepositorio extends JpaRepository<Usuario, Integer> {

    boolean existsByUsuario(String usuario);

    @Query("""
        SELECT 
            CASE WHEN COUNT(*) > 0 
            THEN true 
            ELSE false END
        FROM Usuario u
        WHERE u.persona.id=:id
    """)
    boolean existeUsuarioPersona(
            @Param("id") Integer id
    );

    Optional<Usuario> findByUsuario(String usuario);

    @Query("""
        SELECT new com.salud.consultorio.dto.usuario.UsuarioRolDTO(
            UPPER(CONCAT(u.persona.nombre, ' ', u.persona.apellidos)), 
            UPPER(u.rol.nombre)
        )
        FROM Usuario u
        WHERE u.id = :id
    """)
    Optional<UsuarioRolDTO> obtenerUsuarioYRolPorId(@Param("id") Integer id);


    @Query("""
    SELECT new com.salud.consultorio.dto.usuario.UsuarioListaDTO(
            u.id,
            p.nombre,
            p.correo,
            u.usuario,
            r.nombre,
            u.estado,
            CASE
                WHEN d.id IS NOT NULL THEN 'DOCTOR'
                WHEN pa.id IS NOT NULL THEN 'PACIENTE'
                WHEN re.id IS NOT NULL THEN 'RECEPCIONISTA'
                ELSE 'SIN TIPO'
            END
    )
    FROM Usuario u
    JOIN u.persona p
    JOIN u.rol r
    LEFT JOIN Doctor d ON d.persona = p
    LEFT JOIN Paciente pa ON pa.persona = p
    LEFT JOIN Recepcionista re ON re.persona = p
    """)
    List<UsuarioListaDTO> todosUsuarios();

    @Query("""
    SELECT new com.salud.consultorio.dto.usuario.UsuarioListaDTO(
            u.id,
            p.nombre,
            p.correo,
            u.usuario,
            r.nombre,
            u.estado,
            CASE
                WHEN d.id IS NOT NULL THEN 'DOCTOR'
                WHEN pa.id IS NOT NULL THEN 'PACIENTE'
                WHEN re.id IS NOT NULL THEN 'RECEPCIONISTA'
                ELSE 'SIN TIPO'
            END
    )
    FROM Usuario u
    JOIN u.persona p
    JOIN u.rol r
    LEFT JOIN Doctor d ON d.persona = p
    LEFT JOIN Paciente pa ON pa.persona = p
    LEFT JOIN Recepcionista re ON re.persona = p
    WHERE u.estado=1
    """)
    List<UsuarioListaDTO> todosUsuariosActivos();


    @Query("""
    SELECT new com.salud.consultorio.dto.usuario.UsuarioListaDTO(
            u.id,
            p.nombre,
            p.correo,
            u.usuario,
            r.nombre,
            u.estado,
            CASE
                WHEN d.id IS NOT NULL THEN 'DOCTOR'
                WHEN pa.id IS NOT NULL THEN 'PACIENTE'
                WHEN re.id IS NOT NULL THEN 'RECEPCIONISTA'
                ELSE 'SIN TIPO'
            END
    )
    FROM Usuario u
    JOIN u.persona p
    JOIN u.rol r
    LEFT JOIN Doctor d ON d.persona = p
    LEFT JOIN Paciente pa ON pa.persona = p
    LEFT JOIN Recepcionista re ON re.persona = p
    WHERE u.estado=0
    """)
    List<UsuarioListaDTO> todosUsuariosInactivos();

    @Query("""
    SELECT new com.salud.consultorio.dto.usuario.UsuarioDetalleLeerDTO(
            u.id,
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
            u.usuario,
            r.nombre,
            u.estado,
            CASE
                WHEN d.id IS NOT NULL THEN 'DOCTOR'
                WHEN pa.id IS NOT NULL THEN 'PACIENTE'
                WHEN re.id IS NOT NULL THEN 'RECEPCIONISTA'
                ELSE 'SIN TIPO'
            END
    )
    FROM Usuario u
    JOIN u.persona p
    JOIN u.rol r
    LEFT JOIN Doctor d ON d.persona = p
    LEFT JOIN Paciente pa ON pa.persona = p
    LEFT JOIN Recepcionista re ON re.persona = p
    WHERE u.id = :id
    """)
    Optional<UsuarioDetalleLeerDTO> obtenerDetallePorId(@Param("id") Integer id);

    @Modifying
    @Query("UPDATE Usuario u SET u.estado =:estado WHERE u.id=:id" )
    void UsuarioCambiarEstado(@Param("estado")Integer estado, @Param("id") Integer id);

}