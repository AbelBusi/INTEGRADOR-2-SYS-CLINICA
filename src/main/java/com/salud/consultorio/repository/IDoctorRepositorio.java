package com.salud.consultorio.repository;

import com.salud.consultorio.dto.doctor.DoctorDetalleLeerDTO;
import com.salud.consultorio.dto.doctor.DoctorEspecialidadLeerDTO;
import com.salud.consultorio.dto.doctor.DoctorEspecialidadPorIdDTO;
import com.salud.consultorio.dto.doctor.NombreDoctoresDTO;
import com.salud.consultorio.model.entity.Doctor;
import org.springframework.data.domain.Example;
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
    SELECT new com.salud.consultorio.dto.doctor.NombreDoctoresDTO(
            d.id,
            CONCAT(pe.nombre, ' ', pe.apellidos)
    )    
    FROM Doctor d
    JOIN d.persona pe
    WHERE d.estado = 1
    """)
    List<NombreDoctoresDTO> listarDoctoresResumen();

    @Query("""
    SELECT new com.salud.consultorio.dto.doctor.DoctorEspecialidadLeerDTO(
        d.id,
        d.cpm,
        p.nombre,
        p.apellidos,
        e.nombre,
        p.genero,
        d.estado    
    )
    FROM Doctor d
    JOIN d.persona p
    JOIN d.especialidad e
    """)
    List<DoctorEspecialidadLeerDTO> todosDoctoresEspecialidades();

    @Query("""
    SELECT new com.salud.consultorio.dto.doctor.DoctorEspecialidadLeerDTO(
        d.id,
        d.cpm,
        p.nombre,
        p.apellidos,
        e.nombre,
        p.genero,
        d.estado    
    )
    FROM Doctor d
    JOIN d.persona p
    JOIN d.especialidad e
    WHERE d.id=:id
    """)
    Optional<DoctorEspecialidadLeerDTO> todosDoctoresEspecialidadesPorId(@Param("id")Integer id);

    @Query("""
    SELECT new com.salud.consultorio.dto.doctor.DoctorEspecialidadLeerDTO(
        d.id,
        d.cpm,
        p.nombre,
        p.apellidos,
        e.nombre,
        p.genero,
        d.estado    
    )
    FROM Doctor d
    JOIN d.persona p
    JOIN d.especialidad e
    WHERE d.estado=1
    """)
    List<DoctorEspecialidadLeerDTO> todosDoctoresEspecialidadesActivos();

    @Query("""
    SELECT new com.salud.consultorio.dto.doctor.DoctorEspecialidadLeerDTO(
        d.id,
        d.cpm,
        p.nombre,
        p.apellidos,
        e.nombre,
        p.genero,
        d.estado    
    )
    FROM Doctor d
    JOIN d.persona p
    JOIN d.especialidad e
    WHERE d.estado=0
    """)
    List<DoctorEspecialidadLeerDTO> todosDoctoresEspecialidadesInactivos();

    @Query("SELECT d FROM Doctor d  JOIN FETCH d.persona JOIN FETCH d.especialidad WHERE d.id = :id")
    Optional<Doctor> findByIdConPersona(@Param("id") Integer id);

    @Query("SELECT d FROM Doctor d JOIN Usuario u ON u.persona = d.persona WHERE u.usuario = :usuario")
    Optional<Doctor> findByUsuario(@Param("usuario") String usuario);

    @Modifying
    @Query("UPDATE Doctor d SET d.estado =:estado WHERE d.id=:id" )
    void DoctorCambiarEstado(@Param("estado")Integer estado, @Param("id") Integer id);

    @Query("""
   SELECT new com.salud.consultorio.dto.doctor.DoctorEspecialidadPorIdDTO(
      d.id,
      CONCAT(p.nombre, ' ', p.apellidos) AS nombre
   )
   FROM Doctor d
   JOIN d.persona p
   WHERE d.especialidad.id=:id
   AND d.estado=1
    """)
    List<DoctorEspecialidadPorIdDTO> listaDoctoresEspecialidadSeleccionada(@Param("id") Integer id);

    @Query("""
    SELECT new com.salud.consultorio.dto.doctor.DoctorDetalleLeerDTO(
        d.id,
        new com.salud.consultorio.dto.persona.PersonaLeerDTO(
            p.id,
            p.dni,
            p.nombre,
            p.apellidos,
            p.fechaNacimiento,
            p.genero,
            p.telefono,
            p.nacionalidad,
            p.correo
        ),
        d.cpm,
        d.rne,
        d.consejoRegional,
        new com.salud.consultorio.dto.especialidad.EspecialidadDoctorLeerDTO(
            e.nombre
        ),
        d.estado
    )
    FROM Doctor d
    JOIN d.persona p
    JOIN d.especialidad e
    WHERE d.id = :id
""")
    Optional<DoctorDetalleLeerDTO> obtenerDetallePorId(@Param("id") Integer id);

    boolean existsByCpm(String cpm);

    boolean existsByRne(String rne);
}