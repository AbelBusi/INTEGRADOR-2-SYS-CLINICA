package com.salud.consultorio.dto.atencionClinica;

import com.salud.consultorio.dto.derivacion.DerivacionRespuestaDTO;
import com.salud.consultorio.dto.diagnostico.DiagnosticoRespuestaDTO;
import com.salud.consultorio.dto.examenSolicitado.ExamenSolicitadoRespuestaDTO;
import com.salud.consultorio.dto.indicacion.IndicacionRespuestaDTO;
import com.salud.consultorio.dto.tratamiento.TratamientoRespuestaDTO;

import java.util.List;

public record DiagnosticoDetalleDTO(
        DiagnosticoRespuestaDTO diagnostico,
        List<TratamientoRespuestaDTO> tratamientos,
        List<IndicacionRespuestaDTO> indicaciones,
        List<ExamenSolicitadoRespuestaDTO> examenesSolicitados,
        List<DerivacionRespuestaDTO> derivaciones
) {
}