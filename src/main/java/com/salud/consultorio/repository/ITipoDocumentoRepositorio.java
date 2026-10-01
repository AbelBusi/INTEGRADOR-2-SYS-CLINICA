package com.salud.consultorio.repository;

import com.salud.consultorio.model.entity.TipoDocumento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ITipoDocumentoRepositorio extends JpaRepository<TipoDocumento, Integer> {

}