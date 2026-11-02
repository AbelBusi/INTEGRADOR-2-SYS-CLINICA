package com.salud.consultorio.service;

import com.salud.consultorio.dto.tratamiento.TratamientoActualizarDTO;
import com.salud.consultorio.dto.tratamiento.TratamientoCrearDTO;
import com.salud.consultorio.dto.tratamiento.TratamientoRespuestaDTO;

import java.util.List;

public interface ITratamientoServicio {

    TratamientoRespuestaDTO crear(Integer idDiagnostico, TratamientoCrearDTO dto);

    List<TratamientoRespuestaDTO> listaPorDiagnostico(Integer idDiagnostico);

    TratamientoRespuestaDTO actualizar(Integer idDiagnostico, Integer idTratamiento, TratamientoActualizarDTO dto);

    void eliminar(Integer idDiagnostico, Integer idTratamiento);

}