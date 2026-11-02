package com.salud.consultorio.impl;

import com.salud.consultorio.dto.tipoDocumento.TipoDocumentoResumenDTO;
import com.salud.consultorio.model.entity.TipoDocumento;
import com.salud.consultorio.repository.ITipoDocumentoRepositorio;
import com.salud.consultorio.service.ITipoDocumentoServicio;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TipoDocumentoServicioImpl implements ITipoDocumentoServicio {

    private final ITipoDocumentoRepositorio tipoDocumentoRepositorio;

    @Transactional(readOnly = true)
    @Override
    public Optional<TipoDocumento> entidadPorID(Integer id) {
        return tipoDocumentoRepositorio.findById(id);
    }

    @Transactional(readOnly = true)
    @Override
    public List<TipoDocumentoResumenDTO> listaResumen() {
        return tipoDocumentoRepositorio.listaResumenDatos();
    }

}