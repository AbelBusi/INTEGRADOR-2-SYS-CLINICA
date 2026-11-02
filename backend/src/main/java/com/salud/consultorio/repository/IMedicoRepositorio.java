package com.salud.consultorio.repository;

import com.salud.consultorio.dto.medico.MedicoDetalleDTO;
import com.salud.consultorio.dto.medico.MedicoLeerDTO;
import com.salud.consultorio.dto.medico.MedicoResumenDTO;
import com.salud.consultorio.model.entity.Especialidad;
import com.salud.consultorio.model.entity.Medico;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IMedicoRepositorio extends JpaRepository<Medico, Integer> {

    boolean existsByEspecialidadId(Integer idEspecialidad);

    @Query("""
            SELECT new com.salud.consultorio.dto.medico.MedicoLeerDTO(
                d.id,
                CONCAT(pe.nombre, ' ', pe.apellidos),
                ca.nombre,
                es.nombre,
                d.numeroColegiatura,
                pe.telefono,
                em.foto,
                d.estado
            )
            FROM Medico d
            JOIN d.empleado em
            JOIN em.persona pe
            JOIN em.cargo ca
            JOIN d.especialidad es
            WHERE d.estado = :estado
            """)
    List<MedicoLeerDTO> listaPorEstado(@Param("estado") Integer estado);

    @Query("""
            SELECT new com.salud.consultorio.dto.medico.MedicoLeerDTO(
                d.id,
                CONCAT(pe.nombre, ' ', pe.apellidos),
                ca.nombre,
                es.nombre,
                d.numeroColegiatura,
                pe.telefono,
                em.foto,
                d.estado
            )
            FROM Medico d
            JOIN d.empleado em
            JOIN em.persona pe
            JOIN em.cargo ca
            JOIN d.especialidad es
            WHERE d.estado IN (1, 2)
            """)
    List<MedicoLeerDTO> listaPorEstadoActivoInactivo();

    @Query("""
            SELECT new com.salud.consultorio.dto.medico.MedicoDetalleDTO(
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
            FROM Medico d
            JOIN d.empleado em
            JOIN em.persona pe
            JOIN pe.tipoDocumento td
            JOIN em.cargo ca
            JOIN d.especialidad es
            WHERE d.id = :id
              AND d.estado <> 0
            """)
    Optional<MedicoDetalleDTO> buscarDetallePorId(@Param("id") Integer id);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("UPDATE Medico d SET d.estado = 2 WHERE d.id = :id")
    void desactivarLogicamente(@Param("id") Integer id);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("UPDATE Medico d SET d.estado = 1 WHERE d.id = :id")
    void activarLogicamente(@Param("id") Integer id);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("UPDATE Medico d SET d.estado = 0 WHERE d.id = :id")
    void eliminarLogicamente(@Param("id") Integer id);

    boolean existsByEmpleadoId(Integer idEmpleado);

    boolean existsByNumeroColegiatura(String numeroColegiatura);

    boolean existsByNumeroColegiaturaAndIdNot(String numeroColegiatura, Integer id);

    boolean existsByNumeroEspecialidad(String numeroEspecialidad);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT d FROM Medico d WHERE d.id = :id")
    Optional<Medico> buscarPorIdBloqueado(@Param("id") Integer id);

    @Query("""
            SELECT new com.salud.consultorio.dto.medico.MedicoResumenDTO(
                m.id,
                CONCAT(e.persona.nombre, ' ', e.persona.apellidos)
            )
            FROM Medico m
            JOIN m.empleado e
            JOIN e.persona p
            WHERE m.especialidad.id = :idEspecialidad
              AND m.estado = 1
              AND e.estado = 1
              AND p.estado = 1
            ORDER BY p.apellidos, p.nombre
            """)
    List<MedicoResumenDTO> listarResumenPorEspecialidad(
            @Param("idEspecialidad") Integer idEspecialidad
    );

    @Query("""
            SELECT new com.salud.consultorio.dto.medico.MedicoResumenDTO(
                m.id,
                CONCAT(p.nombre, ' ', p.apellidos)
            )
            FROM Medico m
            JOIN m.empleado e
            JOIN e.persona p
            WHERE m.estado = 1
              AND e.estado = 1
              AND p.estado = 1
            ORDER BY p.apellidos, p.nombre
            """)
    List<MedicoResumenDTO> listarResumen();

    Optional<Medico> findByEmpleado_Persona_Id(Integer idPersona);

}