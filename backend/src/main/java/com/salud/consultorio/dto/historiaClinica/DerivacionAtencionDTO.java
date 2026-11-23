package com.salud.consultorio.dto.historiaClinica;

import java.time.LocalDateTime;

public record DerivacionAtencionDTO(
        Integer id, String codigo, String especialidad, String motivo,
        Integer urgencia, LocalDateTime fechaDerivacion
) {}
