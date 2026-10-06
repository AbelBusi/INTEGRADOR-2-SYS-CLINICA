package com.salud.consultorio.repository;

import com.salud.consultorio.dto.empleado.EmpleadoActivoResumenDTO;
import com.salud.consultorio.dto.empleado.EmpleadoDetalleDTO;
import com.salud.consultorio.dto.empleado.EmpleadoLeerDTO;
import com.salud.consultorio.dto.empleado.EmpleadoMedicoResumenDTO;
import com.salud.consultorio.model.entity.Empleado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IEmpleadoRepositorio extends JpaRepository<Empleado, Integer> {

    @Query("""
            SELECT new com.salud.consultorio.dto.empleado.EmpleadoLeerDTO(
                em.id,
                CONCAT(pe.nombre, ' ', pe.apellidos),
                pe.numeroDocumento,
                pe.telefono,
                ca.nombre,
                em.fechaIngreso,
                em.foto,
                em.estado
            )
            FROM Empleado em
            JOIN em.persona pe
            JOIN em.cargo ca
            WHERE em.estado = :estado
            """)
    List<EmpleadoLeerDTO> listaPorEstado(@Param("estado") Integer estado);

    @Query("""
            SELECT new com.salud.consultorio.dto.empleado.EmpleadoMedicoResumenDTO(
                em.id,
                CONCAT(pe.nombre, ' ', pe.apellidos)
            )
            FROM Empleado em
            JOIN em.persona pe
            JOIN em.cargo ca
            WHERE em.estado = 1
              AND ca.esPersonalMedico = true
              AND NOT EXISTS (
                  SELECT 1
                  FROM Medico me
                  WHERE me.empleado.id = em.id
              )
            """)
    List<EmpleadoMedicoResumenDTO> listarEmpleadoCargoMedico();

    @Query("""
            SELECT new com.salud.consultorio.dto.empleado.EmpleadoActivoResumenDTO(
                em.id,
                CONCAT(pe.nombre, ' ', pe.apellidos)
            )
            FROM Empleado em
            JOIN em.persona pe
            WHERE em.estado = 1
            """)
    List<EmpleadoActivoResumenDTO> listarEmpleadosActivos();

    @Query("""
            SELECT new com.salud.consultorio.dto.empleado.EmpleadoActivoResumenDTO(
                em.id,
                CONCAT(pe.nombre, ' ', pe.apellidos)
            )
            FROM Empleado em
            JOIN em.persona pe
            JOIN em.cargo ca
            WHERE em.estado = 1
              AND ca.id = :idCargo
            """)
    List<EmpleadoActivoResumenDTO> listarEmpleadosActivosPorCargo(@Param("idCargo") Integer idCargo);

    @Query("""
            SELECT new com.salud.consultorio.dto.empleado.EmpleadoLeerDTO(
                em.id,
                CONCAT(pe.nombre, ' ', pe.apellidos),
                pe.numeroDocumento,
                pe.telefono,
                ca.nombre,
                em.fechaIngreso,
                em.foto,
                em.estado
            )
            FROM Empleado em
            JOIN em.persona pe
            JOIN em.cargo ca
            WHERE em.estado IN (1, 2)
            """)
    List<EmpleadoLeerDTO> listaPorEstadoActivoInactivo();

    @Query("""
            SELECT new com.salud.consultorio.dto.empleado.EmpleadoDetalleDTO(
                em.id,
                td.idTipoDocumento,
                td.codigo,
                td.descripcion,
                pe.numeroDocumento,
                pe.nombre,
                pe.apellidos,
                pe.fechaNacimiento,
                pe.genero,
                pe.telefono,
                pe.direccion,
                pe.correo,
                pe.nacionalidad,
                pe.fechaCreacion,
                pe.fechaActualizacion,
                ca.id,
                ca.nombre,
                em.fechaIngreso,
                em.fechaRetiro,
                em.foto,
                em.estado
            )
            FROM Empleado em
            JOIN em.persona pe
            JOIN pe.tipoDocumento td
            JOIN em.cargo ca
            WHERE em.id = :id
            """)
    Optional<EmpleadoDetalleDTO> buscarDetallePorId(@Param("id") Integer id);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("UPDATE Empleado em SET em.estado = 2 WHERE em.id = :id")
    void desactivarLogicamente(@Param("id") Integer id);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("UPDATE Empleado em SET em.estado = 1 WHERE em.id = :id")
    void activarLogicamente(@Param("id") Integer id);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("UPDATE Empleado em SET em.estado = 0 WHERE em.id = :id")
    void eliminarLogicamente(@Param("id") Integer id);

}