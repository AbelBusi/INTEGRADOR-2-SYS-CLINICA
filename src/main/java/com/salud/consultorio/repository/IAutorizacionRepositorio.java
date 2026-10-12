package com.salud.consultorio.repository;

import com.salud.consultorio.dto.autorizacion.PermisosProyeccion;
import com.salud.consultorio.model.entity.RolPermiso;
import org.springframework.data.jpa.repository.JpaRepository;
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

}