package com.salud.consultorio.repository;

import com.salud.consultorio.dto.doctor.DoctorDetalleDTO;
import com.salud.consultorio.dto.doctor.DoctorLeerDTO;
import com.salud.consultorio.model.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IDoctorRepositorio extends JpaRepository<Doctor, Integer> {

    @Query("""
            SELECT new com.salud.consultorio.dto.doctor.DoctorLeerDTO(
                d.id,
                CONCAT(pe.nombre, ' ', pe.apellidos),
                ca.nombre,
                es.nombre,
                d.numeroColegiatura,
                pe.telefono,
                em.foto,
                d.estado
            )
            FROM Doctor d
            JOIN d.empleado em
            JOIN em.persona pe
            JOIN em.cargo ca
            JOIN d.especialidad es
            WHERE d.estado = :estado
            """)
    List<DoctorLeerDTO> listaPorEstado(@Param("estado") Integer estado);

    @Query("""
            SELECT new com.salud.consultorio.dto.doctor.DoctorLeerDTO(
                d.id,
                CONCAT(pe.nombre, ' ', pe.apellidos),
                ca.nombre,
                es.nombre,
                d.numeroColegiatura,
                pe.telefono,
                em.foto,
                d.estado
            )
            FROM Doctor d
            JOIN d.empleado em
            JOIN em.persona pe
            JOIN em.cargo ca
            JOIN d.especialidad es
            WHERE d.estado IN (1, 2)
            """)
    List<DoctorLeerDTO> listaPorEstadoActivoInactivo();

    @Query("""
            SELECT new com.salud.consultorio.dto.doctor.DoctorDetalleDTO(
                d.id,
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
                em.id,
                ca.id,
                ca.nombre,
                em.fechaIngreso,
                em.fechaRetiro,
                em.foto,
                em.estado,
                es.id,
                es.nombre,
                d.numeroColegiatura,
                d.numeroEspecialidad,
                d.consejoRegional,
                d.estado
            )
            FROM Doctor d
            JOIN d.empleado em
            JOIN em.persona pe
            JOIN pe.tipoDocumento td
            JOIN em.cargo ca
            JOIN d.especialidad es
            WHERE d.id = :id
              AND d.estado <> 0
            """)
    Optional<DoctorDetalleDTO> buscarDetallePorId(@Param("id") Integer id);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("UPDATE Doctor d SET d.estado = 2 WHERE d.id = :id")
    void desactivarLogicamente(@Param("id") Integer id);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("UPDATE Doctor d SET d.estado = 1 WHERE d.id = :id")
    void activarLogicamente(@Param("id") Integer id);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("UPDATE Doctor d SET d.estado = 0 WHERE d.id = :id")
    void eliminarLogicamente(@Param("id") Integer id);

    boolean existsByEmpleadoId(Integer idEmpleado);

    boolean existsByNumeroColegiatura(String numeroColegiatura);

    boolean existsByNumeroColegiaturaAndIdNot(String numeroColegiatura, Integer id);

}