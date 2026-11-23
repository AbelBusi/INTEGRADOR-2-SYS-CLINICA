package com.salud.consultorio.dto.historiaClinica;

import com.salud.consultorio.model.enums.FactorRh;
import com.salud.consultorio.model.enums.GrupoSanguineo;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record HistoriaClinicaActualizarDTO(
        GrupoSanguineo grupoSanguineo,
        FactorRh factorRh,
        @Size(max = 500, message = "Las observaciones no pueden superar los 500 caracteres") String observaciones,
        @NotNull(message = "La versión de la historia clínica es obligatoria") Integer version
) {}