package com.salud.consultorio.dto.historiaClinica;

import com.salud.consultorio.model.enums.TipoAntecedentePersonal;

import java.time.LocalDateTime;

public record AntecedentePersonalRespuestaDTO(
        Integer id, TipoAntecedentePersonal tipo, String descripcion, Integer anio,
        String observacion, LocalDateTime fechaActualizacion
) {}