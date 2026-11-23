package com.salud.consultorio.dto.historiaClinica;

import com.salud.consultorio.model.enums.Parentesco;
import com.salud.consultorio.model.enums.TipoAntecedenteFamiliar;

import java.time.LocalDateTime;

public record AntecedenteFamiliarRespuestaDTO(
        Integer id, TipoAntecedenteFamiliar tipo, Parentesco parentesco, String descripcion,
        String observacion, LocalDateTime fechaActualizacion
) {}
