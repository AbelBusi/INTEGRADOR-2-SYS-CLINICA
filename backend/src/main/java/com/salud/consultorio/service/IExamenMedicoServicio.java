package com.salud.consultorio.service;

import com.salud.consultorio.dto.examenMedico.ExamenMedicoBusquedaDTO;
import com.salud.consultorio.dto.examenMedico.ExamenMedicoRequestDTO;
import com.salud.consultorio.dto.examenMedico.ExamenMedicoRespuestaDTO;

import java.util.List;

public interface IExamenMedicoServicio {

    List<ExamenMedicoRespuestaDTO> listar(String estado);

    List<ExamenMedicoBusquedaDTO> buscarPorNombre(String busqueda);

    List<ExamenMedicoBusquedaDTO> listarResumen();

    ExamenMedicoRespuestaDTO crear(ExamenMedicoRequestDTO request);

    ExamenMedicoRespuestaDTO actualizar(Integer id, ExamenMedicoRequestDTO request);

    void cambiarEstado(Integer id, String estado);
}