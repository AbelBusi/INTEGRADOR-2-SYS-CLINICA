package com.salud.consultorio.service;

import com.salud.consultorio.dto.citaMedica.CitaMedicaActualizarDTO;
import com.salud.consultorio.dto.citaMedica.CitaMedicaCrearDTO;
import com.salud.consultorio.dto.citaMedica.CitaMedicaRespuestaDTO;
import com.salud.consultorio.model.enums.ResolucionRegularizacion;

import java.util.List;

public interface ICitaMedicaServicio {

    List<CitaMedicaRespuestaDTO> lista(Integer estado);

    List<CitaMedicaRespuestaDTO> listaMisCitasMedico(Integer estado);

    List<CitaMedicaRespuestaDTO> listaMisCitasPaciente(Integer estado);

    CitaMedicaRespuestaDTO entidadPorID(Integer id);

    CitaMedicaRespuestaDTO crear(CitaMedicaCrearDTO dto);

    CitaMedicaRespuestaDTO actualizar(CitaMedicaActualizarDTO dto, Integer id);

    void cancelar(Integer id, String observacion);

    void atender(Integer id, String observacion);

    void eliminarPorId(Integer id);

    List<CitaMedicaRespuestaDTO> listaPendientesRegularizacion();

    List<CitaMedicaRespuestaDTO> listaMisPendientesRegularizacionMedico();

    void regularizar(Integer id, ResolucionRegularizacion resolucion, String observacion);

}