package com.salud.consultorio.repository;

import com.salud.consultorio.dto.usuario.UsuarioRolAsignadoDTO;
import com.salud.consultorio.model.entity.UsuarioRol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface IUsuarioRolRepositorio extends JpaRepository<UsuarioRol, Integer> {

    List<UsuarioRol> findAllByUsuario_Usuario(String usuario);

    List<UsuarioRol> findAllByUsuario_UsuarioAndEstadoAndRol_Estado(
            String usuario,
            Integer estadoAsignacion,
            Integer estadoRol
    );

    boolean existsByUsuario_IdAndRol_Id(
            Integer idUsuario,
            Integer idRol
    );

    Optional<UsuarioRol> findByUsuario_IdAndRol_Id(Integer idUsuario, Integer idRol);

    long countByUsuario_IdAndEstadoAndRol_Estado(Integer idUsuario, Integer estadoAsignacion, Integer estadoRol);

    boolean existsByRol_IdAndEstadoNot(Integer idRol, Integer estadoAsignacion);

    @Query("""
            SELECT new com.salud.consultorio.dto.usuario.UsuarioRolAsignadoDTO(
                ur.usuario.id,
                r.id,
                r.nombre
            )
            FROM UsuarioRol ur
            JOIN ur.rol r
            WHERE ur.usuario.id IN :ids
              AND ur.estado = 1
              AND r.estado = 1
            ORDER BY r.nombre
            """)
    List<UsuarioRolAsignadoDTO> listarRolesActivosPorUsuarios(@Param("ids") Collection<Integer> ids);

    @Modifying
    @Query("""
            UPDATE Token t
            SET t.expired = true, t.revoked = true
            WHERE t.expired = false
              AND t.revoked = false
              AND t.usuario.id IN (
                  SELECT ur.usuario.id
                  FROM UsuarioRol ur
                  WHERE ur.rol.id = :idRol
                    AND ur.estado = 1
              )
            """)
    int revocarSesionesPorRol(@Param("idRol") Integer idRol);

    @Query("""
            SELECT CASE WHEN COUNT(ur) > 0 THEN true ELSE false END
            FROM UsuarioRol ur
            WHERE ur.usuario.id = :idUsuario
              AND ur.rol.id = :idRol
              AND ur.estado = 1
            """)
    boolean existeAsignacionActiva(@Param("idUsuario") Integer idUsuario, @Param("idRol") Integer idRol);

    @Query("""
            SELECT COUNT(ur)
            FROM UsuarioRol ur
            WHERE ur.usuario.id = :idUsuario
              AND ur.estado = 1
              AND ur.rol.estado = 1
            """)
    long contarAsignacionesActivas(@Param("idUsuario") Integer idUsuario);

    @Query("""
            SELECT CASE WHEN COUNT(p) > 0 THEN true ELSE false END
            FROM Paciente p
            WHERE p.persona.id = :idPersona AND p.estado = 1
            """)
    boolean personaEsPacienteActivo(@Param("idPersona") Integer idPersona);

    @Query("""
            SELECT CASE WHEN COUNT(e) > 0 THEN true ELSE false END
            FROM Empleado e
            WHERE e.persona.id = :idPersona AND e.estado = 1
            """)
    boolean personaEsEmpleadoActivo(@Param("idPersona") Integer idPersona);

}