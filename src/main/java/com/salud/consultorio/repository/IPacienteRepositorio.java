package com.salud.consultorio.repository;

import com.salud.consultorio.dto.paciente.PacienteDetalleDTO;
import com.salud.consultorio.dto.paciente.PacienteLeerDTO;
import com.salud.consultorio.model.entity.Paciente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface IPacienteRepositorio extends JpaRepository<Paciente, Integer> {

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


}