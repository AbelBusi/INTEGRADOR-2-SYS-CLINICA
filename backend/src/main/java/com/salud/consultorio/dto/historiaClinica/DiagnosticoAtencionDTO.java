package com.salud.consultorio.dto.historiaClinica;

import java.time.LocalDateTime;
import java.util.List;

public record DiagnosticoAtencionDTO(
        Integer id, String codigo, String descripcion, Integer tipoDiagnostico,
        String observaciones, LocalDateTime fechaDiagnostico,
        List<TratamientoAtencionDTO> tratamientos,
        List<IndicacionAtencionDTO> indicaciones,
        List<DerivacionAtencionDTO> derivaciones
) {}