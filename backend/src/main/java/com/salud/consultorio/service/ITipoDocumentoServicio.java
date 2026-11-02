package com.salud.consultorio.service;

import com.salud.consultorio.dto.tipoDocumento.TipoDocumentoResumenDTO;
import com.salud.consultorio.model.entity.TipoDocumento;

import java.util.List;
import java.util.Optional;

public interface ITipoDocumentoServicio {

    Optional<TipoDocumento> entidadPorID(Integer id);

    List<TipoDocumentoResumenDTO> listaResumen();

}