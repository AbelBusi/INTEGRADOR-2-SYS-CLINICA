package com.salud.consultorio.service;

import com.salud.consultorio.dto.comunicado.ComunicadoCrearDTO;
import com.salud.consultorio.dto.comunicado.ComunicadoLeerDTO;

import java.util.List;

public interface IComunicadoServicio {

    List<ComunicadoLeerDTO> listar();

    ComunicadoLeerDTO crear(ComunicadoCrearDTO dto);

}
