package com.salud.consultorio.repository;

import com.salud.consultorio.dto.tipoDocumento.TipoDocumentoResumenDTO;
import com.salud.consultorio.model.entity.TipoDocumento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ITipoDocumentoRepositorio extends JpaRepository<TipoDocumento, Integer> {

    @Query("""
            SELECT new com.salud.consultorio.dto.tipoDocumento.TipoDocumentoResumenDTO(
                t.idTipoDocumento,
                t.codigo    
                )
            FROM TipoDocumento t
            WHERE t.estado=1
            """)
    List<TipoDocumentoResumenDTO> listaResumenDatos();


}