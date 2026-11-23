package com.salud.consultorio.dto.historiaClinica;

import com.salud.consultorio.model.enums.FactorRh;
import com.salud.consultorio.model.enums.GrupoSanguineo;

import java.time.LocalDateTime;

public record HistoriaClinicaResumenDTO(
        Integer id, String numeroHistoria,
        Integer idPaciente, String nombreCompleto, String numeroDocumento,
        GrupoSanguineo grupoSanguineo, FactorRh factorRh,
        LocalDateTime fechaCreacion, LocalDateTime fechaActualizacion
) {}
