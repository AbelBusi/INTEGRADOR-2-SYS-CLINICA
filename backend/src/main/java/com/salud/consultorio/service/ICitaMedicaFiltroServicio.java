package com.salud.consultorio.service;

import com.salud.consultorio.dto.citaMedica.CitaMedicaFiltroDTO;
import com.salud.consultorio.dto.citaMedica.CitaMedicaPaginaDTO;
import org.springframework.data.domain.Pageable;

public interface ICitaMedicaFiltroServicio {

    CitaMedicaPaginaDTO buscar(CitaMedicaFiltroDTO filtro, Pageable pageable);
}