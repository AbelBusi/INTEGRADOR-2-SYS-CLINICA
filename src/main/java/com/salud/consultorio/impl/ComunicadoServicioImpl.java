package com.salud.consultorio.impl;

import com.salud.consultorio.dto.comunicado.ComunicadoCrearDTO;
import com.salud.consultorio.dto.comunicado.ComunicadoLeerDTO;
import com.salud.consultorio.model.entity.Comunicado;
import com.salud.consultorio.repository.IComunicadoRepositorio;
import com.salud.consultorio.service.IComunicadoServicio;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ComunicadoServicioImpl implements IComunicadoServicio {

    private final IComunicadoRepositorio comunicadoRepositorio;

    @Transactional(readOnly = true)
    @Override
    public List<ComunicadoLeerDTO> listar() {
        return comunicadoRepositorio.leerActivos();
    }

    @Transactional
    @Override
    public ComunicadoLeerDTO crear(ComunicadoCrearDTO dto) {

        Comunicado comunicado = Comunicado.builder()
                .titulo(dto.getTitulo())
                .mensaje(dto.getMensaje())
                .fecha(LocalDate.now())
                .estado(1)
                .build();

        Comunicado guardado = comunicadoRepositorio.save(comunicado);

        return new ComunicadoLeerDTO(guardado.getId(), guardado.getTitulo(), guardado.getMensaje(), guardado.getFecha());
    }
}
