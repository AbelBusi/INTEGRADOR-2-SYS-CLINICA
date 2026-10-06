package com.salud.consultorio.repository;

import com.salud.consultorio.auth.dto.rol.UsuarioRolDTO;
import com.salud.consultorio.model.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IUsuarioRepositorio extends JpaRepository<Usuario, Integer> {

    boolean existsByUsuario(String usuario);

    @Query("""
        SELECT 
            CASE WHEN COUNT(*) > 0 
            THEN true 
            ELSE false END
        FROM Usuario u
        WHERE u.persona.id=:id
    """)
    boolean existeUsuarioPersona(
            @Param("id") Integer id
    );

    Optional<Usuario> findByUsuario(String usuario);

    @Query("""
        SELECT new com.salud.consultorio.auth.dto.rol.UsuarioRolDTO(
            UPPER(CONCAT(u.persona.nombre, ' ', u.persona.apellidos)), 
            UPPER(u.rol.nombre)
        )
        FROM Usuario u
        WHERE u.id = :id
    """)
    Optional<UsuarioRolDTO> obtenerUsuarioYRolPorId(@Param("id") Integer id);


    @Modifying
    @Query("UPDATE Usuario u SET u.estado =:estado WHERE u.id=:id" )
    void UsuarioCambiarEstado(@Param("estado")Integer estado, @Param("id") Integer id);

}