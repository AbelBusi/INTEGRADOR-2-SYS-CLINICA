package com.salud.consultorio.repository;

import com.salud.consultorio.auth.dto.rol.UsuarioRolDTO;
import com.salud.consultorio.dto.usuario.PersonaUsuarioDTO;
import com.salud.consultorio.dto.usuario.UsuarioListadoDTO;
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
                    UPPER(u.rol.nombre)
                )
                FROM Usuario u
                WHERE u.id = :id
            """)
    Optional<UsuarioRolDTO> obtenerUsuarioYRolPorId(@Param("id") Integer id);


    @Modifying
    @Query("UPDATE Usuario u SET u.estado =:estado WHERE u.id=:id")
    void UsuarioCambiarEstado(@Param("estado") Integer estado, @Param("id") Integer id);

    @Query("""
                SELECT new com.salud.consultorio.dto.usuario.PersonaUsuarioDTO(
                    e.persona.id,
                    CONCAT(e.persona.nombre, ' ', e.persona.apellidos)
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
            SELECT new com.salud.consultorio.dto.usuario.UsuarioListadoDto(
                u.id,
                CONCAT(p.nombre, ' ', p.apellidos),
                u.usuario,
                r.nombre,
                u.fechaCreacion,
                u.fechaActualizacion,
                u.requiereCambioClave,
                u.estado
            )
            FROM Usuario u
            JOIN u.persona p
            JOIN u.rol r
            WHERE u.estado = :estado
            ORDER BY u.id DESC
            """)
    List<UsuarioListadoDTO> listarUsuariosPorEstado(@Param("estado") Integer estado);

    @Query("""
            SELECT new com.salud.consultorio.model.dto.usuario.UsuarioListadoDto(
                u.id,
                CONCAT(p.nombre, ' ', p.apellidos),
                u.usuario,
                r.nombre,
                u.fechaCreacion,
                u.fechaActualizacion,
                u.requiereCambioClave,
                u.estado
            )
            FROM Usuario u
            JOIN u.persona p
            JOIN u.rol r
            WHERE u.estado IN (1, 2)
            ORDER BY u.id DESC
            """)
    List<UsuarioListadoDTO> listarUsuarios();

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("UPDATE Usuario u SET u.estado = 2 WHERE u.id = :id")
    void desactivarLogicamente(@Param("id") Integer id);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("UPDATE Usuario u SET u.estado = 1 WHERE u.id = :id")
    void activarLogicamente(@Param("id") Integer id);

}