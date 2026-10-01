package com.salud.consultorio.service;

import com.salud.consultorio.model.entity.TipoDocumento;

import java.util.Optional;

public interface ITipoDocumentoServicio {

    Optional<TipoDocumento> obtenerEntidadPorID(Integer id);

}