package com.salud.consultorio.repository;

import com.salud.consultorio.dto.paciente.PacienteDetalleDTO;
import com.salud.consultorio.dto.paciente.PacienteIDPorBuscarNroDocDTO;
import com.salud.consultorio.dto.paciente.PacienteLeerDTO;
import com.salud.consultorio.dto.paciente.PacienteResumenDTO;
import com.salud.consultorio.dto.usuario.PersonaUsuarioDTO;
import com.salud.consultorio.model.entity.Paciente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.Optional;

@Repository
public interface IPacienteRepositorio extends JpaRepository<Paciente, Integer> {

    boolean existsByPersona_Id(Integer idPaciente);

    boolean existsByCodigoAsegurado(String codigoAsegurado);

    @Query("SELECT p.persona.id FROM Paciente p WHERE p.id = :idPaciente")
    Integer pacientePersonaID(@PathVariable("idPaciente") Integer idPaciente);

    @Query("""
            SELECT new com.salud.consultorio.dto.paciente.PacienteLeerDTO(
                pa.id,
                CONCAT(pe.nombre, ' ',pe.apellidos),
                pe.genero,
                pe.telefono,
                pa.codigoAsegurado,
                pa.entidadAsegurado,
                pa.estado    
                )
            FROM Paciente pa
            JOIN pa.persona pe
            WHERE pa.estado= :estado
            """)
    List<PacienteLeerDTO> listaPorEstado(@Param("estado") Integer estado);

    @Query("""
            SELECT new com.salud.consultorio.dto.paciente.PacienteLeerDTO(
                pa.id,
                CONCAT(pe.nombre, ' ',pe.apellidos),
                pe.genero,
                pe.telefono,
                pa.codigoAsegurado,
                pa.entidadAsegurado,
                pa.estado    
                )
            FROM Paciente pa
            JOIN pa.persona pe
            WHERE pa.estado =1 or pa.estado = 2
            """)
    List<PacienteLeerDTO> listaPorEstadoActivoInactivo();

    @Modifying
    @Query("UPDATE Paciente pa SET pa.estado =2 WHERE pa.id=:id")
    void desactivarLogicamente(@Param("id") Integer id);

    @Modifying
    @Query("UPDATE Paciente pa SET pa.estado =1 WHERE pa.id=:id")
    void activarLogicamente(@Param("id") Integer id);

    @Modifying
    @Query("UPDATE Paciente pa SET pa.estado =0 WHERE pa.id=:id")
    void eliminarLogicamente(@Param("id") Integer id);

    @Modifying
    @Query("UPDATE Paciente pa SET pa.estado =1 WHERE pa.id=:id")
    void reactivarLogicamente(@Param("id") Integer id);

    @Query("""
            SELECT new com.salud.consultorio.dto.paciente.PacienteDetalleDTO(
                pa.id,
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
                pa.codigoAsegurado,
                pa.entidadAsegurado,
                pa.estado
            )
            FROM Paciente pa
            JOIN pa.persona pe
            JOIN pe.tipoDocumento td
            WHERE pa.id = :id
            """)
    Optional<PacienteDetalleDTO> buscarDetallePorId(@Param("id") Integer id);

    boolean existsByCodigoAseguradoAndIdNot(String codigoAsegurado, Integer id);


    @Query("""
                SELECT new com.salud.consultorio.dto.usuario.PersonaUsuarioDTO(
                    p.persona.id,
                    CONCAT(p.persona.nombre, ' ', p.persona.apellidos),
                    p.persona.numeroDocumento
                )
                FROM Paciente p
                WHERE p.estado = 1
                AND NOT EXISTS (
                    SELECT u.id
                    FROM Usuario u
                    WHERE u.persona.id = p.persona.id
                )
                ORDER BY p.persona.apellidos, p.persona.nombre
            """)
    List<PersonaUsuarioDTO> listarParaCrearUsuario();

    @Query("""
            SELECT new com.salud.consultorio.dto.paciente.PacienteIDPorBuscarNroDocDTO(
                pa.id,
                p.id,
                e.id,
                CONCAT(p.nombre, ' ', p.apellidos),
                CASE
                    WHEN e.id IS NULL THEN 'REGISTRAR'
                    WHEN e.estado = 1 THEN 'ACTIVO'
                    WHEN e.estado = 2 THEN 'DESACTIVADO'
                    WHEN e.estado = 0 THEN 'REACTIVAR'
                    ELSE 'DESCONOCIDO'
                END
            )
            FROM Paciente pa
            JOIN pa.persona p
            LEFT JOIN Empleado e ON e.persona.id = p.id
            WHERE p.numeroDocumento = :nroDocumento
              AND pa.estado = 1
              AND p.estado = 1
            """)
    PacienteIDPorBuscarNroDocDTO pacienteIDporNroDocumento(
            @Param("nroDocumento") String nroDocumento
    );

    @Query("""
            SELECT new com.salud.consultorio.dto.paciente.PacienteResumenDTO(
                pa.id,
                CONCAT(pe.nombre, ' ', pe.apellidos)
            )
            FROM Paciente pa
            JOIN pa.persona pe
            WHERE pa.estado = 1
              AND pe.estado = 1
            ORDER BY pe.apellidos, pe.nombre
            """)
    List<PacienteResumenDTO> listarResumen();

}