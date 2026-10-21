package com.salud.consultorio.repository;

import com.salud.consultorio.dto.autorizacion.PermisosProyeccion;
import com.salud.consultorio.model.entity.RolPermiso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IAutorizacionRepositorio extends JpaRepository<RolPermiso, Integer> {

    boolean existsByRol_IdAndPermiso_Id(Integer idRol, Integer idPermiso);

    @Query("""
            SELECT new com.salud.consultorio.dto.autorizacion.PermisosProyeccion(
                p.id,
                p.modulo,
                p.nombre,
                p.codigo
            )
            FROM  RolPermiso rp
            JOIN  rp.permiso p
            WHERE rp.rol.id = :idRol
            """)
    List<PermisosProyeccion> listarPermisosPorRol(
            @Param("idRol") Integer idRol
    );

    @Query("""
            SELECT new com.salud.consultorio.dto.autorizacion.PermisosProyeccion(
                p.id,
                p.modulo,
                p.nombre,
                p.codigo
            )
            FROM Permiso p
            ORDER BY p.modulo, p.nombre
            """)
    List<PermisosProyeccion> listarPermisos();

    List<RolPermiso> findByRol_Id(Integer idRol);

    @Query("SELECT rp.permiso.id FROM RolPermiso rp WHERE rp.rol.id = :idRol")
    List<Integer> idsPermisoPorRol(@Param("idRol") Integer idRol);

    @Modifying(flushAutomatically = true)
    @Query("DELETE FROM RolPermiso rp WHERE rp.rol.id = :idRol AND rp.permiso.id IN :idPermisos")
    int eliminarPorRolYPermisos(
            @Param("idRol") Integer idRol,
            @Param("idPermisos") List<Integer> idPermisos
    );

}