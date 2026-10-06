package com.salud.consultorio.repository;

import com.salud.consultorio.auth.dto.rol.RolRespuestaDTO;
import com.salud.consultorio.auth.dto.rol.RolResumenDTO;
import com.salud.consultorio.dto.especialidad.EspecialidadResumenDTO;
import com.salud.consultorio.model.entity.Rol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IRolRepositorio extends JpaRepository<Rol, Integer> {

    boolean existsByNombre(String nombre);

    @Query("""
            SELECT new com.salud.consultorio.auth.dto.rol.RolRespuestaDTO(
                r.id,
                r.nombre,
                r.descripcion,
                r.estado    
                )
            FROM Rol r
            WHERE r.estado= :estado
            """)
    List<RolRespuestaDTO> listaPorEstado(@Param("estado") Integer estado);

    @Query(value = """
            SELECT new com.salud.consultorio.auth.dto.rol.RolRespuestaDTO(
                r.id,
                r.nombre,
                r.descripcion,
                r.estado    
                )
            FROM Rol r
            WHERE r.estado=1 OR r.estado=2
            """)
    List<RolRespuestaDTO> listaPorEstadoActivoInactivo();

    @Modifying
    @Query("UPDATE Rol r SET r.estado =2 WHERE r.id=:id")
    void desactivarLogicamente(@Param("id") Integer id);

    @Modifying
    @Query("UPDATE Rol r SET r.estado =1 WHERE r.id=:id")
    void activarLogicamente(@Param("id") Integer id);

    @Modifying
    @Query("UPDATE Rol r SET r.estado =0 WHERE r.id=:id")
    void eliminarLogicamente(@Param("id") Integer id);

    boolean existsByNombreAndIdNot(String nombre, Integer id);

    @Query("""
            SELECT new com.salud.consultorio.auth.dto.rol.RolResumenDTO(
                r.id,
                r.nombre
                )
            FROM Rol r
            WHERE r.estado=1
            """)
    List<RolResumenDTO> listaPorNombreResumen();


}