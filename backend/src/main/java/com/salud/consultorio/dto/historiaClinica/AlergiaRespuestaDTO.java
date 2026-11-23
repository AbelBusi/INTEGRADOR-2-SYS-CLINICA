package com.salud.consultorio.dto.historiaClinica;

import com.salud.consultorio.model.enums.TipoAlergia;

import java.time.LocalDateTime;

public record AlergiaRespuestaDTO(
        Integer id, String sustancia, TipoAlergia tipoAlergia, String reaccion,
        String observacion, LocalDateTime fechaActualizacion
) {}