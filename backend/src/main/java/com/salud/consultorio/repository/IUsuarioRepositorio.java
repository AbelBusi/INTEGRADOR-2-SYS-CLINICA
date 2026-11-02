package com.salud.consultorio.repository;

import com.salud.consultorio.auth.dto.rol.UsuarioRolDTO;
import com.salud.consultorio.dto.usuario.PersonaUsuarioDTO;
import com.salud.consultorio.dto.usuario.UsuarioBaseDTO;
import com.salud.consultorio.model.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

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
            SELECT new com.salud.consultorio.auth.dto.rol.UsuarioRolDTO(
                UPPER(CONCAT(u.persona.nombre, ' ', u.persona.apellidos)),
                UPPER(ur.rol.nombre)
            )
            FROM Usuario u
            JOIN UsuarioRol ur ON ur.usuario = u
            WHERE u.id = :id
              AND ur.estado = 1
              AND ur.rol.estado = 1
            """)
    List<UsuarioRolDTO> obtenerUsuariosYRolesPorId(@Param("id") Integer id);

    @Modifying
    @Query("UPDATE Usuario u SET u.estado =:estado WHERE u.id=:id")
    void UsuarioCambiarEstado(@Param("estado") Integer estado, @Param("id") Integer id);

    @Query("""
                SELECT new com.salud.consultorio.dto.usuario.PersonaUsuarioDTO(
                    e.persona.id,
                    CONCAT(e.persona.nombre, ' ', e.persona.apellidos),
                    e.persona.numeroDocumento
                )
                FROM Empleado e
                WHERE e.estado = 1
                AND NOT EXISTS (
                    SELECT u.id
                    FROM Usuario u
                    WHERE u.persona.id = e.persona.id
                )
                ORDER BY e.persona.apellidos, e.persona.nombre
            """)
    List<PersonaUsuarioDTO> listarParaCrearUsuario();

    @Query("""
            SELECT new com.salud.consultorio.dto.usuario.UsuarioBaseDTO(
                u.id,
                u.usuario,
                CONCAT(u.persona.nombre, ' ', u.persona.apellidos),
                u.persona.numeroDocumento,
                u.estado
            )
            FROM Usuario u
            WHERE (:estado IS NULL AND u.estado <> 0) OR u.estado = :estado
            ORDER BY u.persona.apellidos, u.persona.nombre
            """)
    List<UsuarioBaseDTO> listarUsuarios(@Param("estado") Integer estado);

    @Query("""
            SELECT new com.salud.consultorio.dto.usuario.UsuarioBaseDTO(
                u.id,
                u.usuario,
                CONCAT(u.persona.nombre, ' ', u.persona.apellidos),
                u.persona.numeroDocumento,
                u.estado
            )
            FROM Usuario u
            WHERE ((:estado IS NULL AND u.estado <> 0) OR u.estado = :estado)
              AND EXISTS (SELECT 1 FROM Empleado e WHERE e.persona.id = u.persona.id)
            ORDER BY u.persona.apellidos, u.persona.nombre
            """)
    List<UsuarioBaseDTO> listarUsuariosEmpleados(@Param("estado") Integer estado);

    @Query("""
            SELECT new com.salud.consultorio.dto.usuario.UsuarioBaseDTO(
                u.id,
                u.usuario,
                CONCAT(u.persona.nombre, ' ', u.persona.apellidos),
                u.persona.numeroDocumento,
                u.estado
            )
            FROM Usuario u
            WHERE ((:estado IS NULL AND u.estado <> 0) OR u.estado = :estado)
              AND EXISTS (SELECT 1 FROM Paciente p WHERE p.persona.id = u.persona.id)
            ORDER BY u.persona.apellidos, u.persona.nombre
            """)
    List<UsuarioBaseDTO> listarUsuariosPacientes(@Param("estado") Integer estado);

    @Query("""
            SELECT CASE WHEN COUNT(p) > 0 THEN true ELSE false END
            FROM Paciente p
            WHERE p.persona.id = (SELECT u.persona.id FROM Usuario u WHERE u.id = :idUsuario)
            """)
    boolean esPaciente(@Param("idUsuario") Integer idUsuario);

    @Query("""
            SELECT CASE WHEN COUNT(e) > 0 THEN true ELSE false END
            FROM Empleado e
            WHERE e.persona.id = (
                SELECT u.persona.id
                FROM Usuario u
                WHERE u.id = :idUsuario
            )
            """)
    boolean esEmpleado(@Param("idUsuario") Integer idUsuario);

    @Query("""
        SELECT CASE WHEN COUNT(ur) > 0 THEN true ELSE false END
        FROM UsuarioRol ur
        WHERE ur.usuario.id = :idUsuario
          AND ur.estado = 1
          AND ur.rol.estado = 1
          AND UPPER(ur.rol.nombre) = :nombreRol
        """)
    boolean tieneRolActivo(@Param("idUsuario") Integer idUsuario, @Param("nombreRol") String nombreRol);
}