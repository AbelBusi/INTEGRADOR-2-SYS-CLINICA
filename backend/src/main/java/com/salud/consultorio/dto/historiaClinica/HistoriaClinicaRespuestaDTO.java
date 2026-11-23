package com.salud.consultorio.dto.historiaClinica;

import com.salud.consultorio.model.enums.FactorRh;
import com.salud.consultorio.model.enums.GrupoSanguineo;

import java.time.LocalDateTime;
import java.util.List;

public record HistoriaClinicaRespuestaDTO(
        Integer id, String numeroHistoria, PacienteHistoriaDTO paciente,
        GrupoSanguineo grupoSanguineo, FactorRh factorRh, String observaciones,
        LocalDateTime fechaCreacion, LocalDateTime fechaActualizacion,
        List<AntecedentePersonalRespuestaDTO> antecedentesPersonales,
        List<AntecedenteFamiliarRespuestaDTO> antecedentesFamiliares,
        List<AlergiaRespuestaDTO> alergias,
        Integer version
) {}