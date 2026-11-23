package com.salud.consultorio.service;

import com.salud.consultorio.dto.historiaClinica.AtencionHistoriaDTO;
import com.salud.consultorio.dto.historiaClinica.PaginaDTO;

public interface IAtencionHistoriaServicio {
    PaginaDTO<AtencionHistoriaDTO> listarPorPaciente(Integer idPaciente, int pagina, int tamanio);
    PaginaDTO<AtencionHistoriaDTO> listarMias(int pagina, int tamanio);
}