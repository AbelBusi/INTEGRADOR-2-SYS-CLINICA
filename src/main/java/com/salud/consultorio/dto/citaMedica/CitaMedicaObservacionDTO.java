package com.salud.consultorio.dto.citaMedica;

import jakarta.validation.constraints.Size;

public record CitaMedicaObservacionDTO(
        @Size(max = 300, message = "La observación no puede superar los 300 caracteres")
        String observacion
) {}