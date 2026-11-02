package com.salud.consultorio.dto.examenSolicitado;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ExamenSolicitadoCrearDTO(
        @NotBlank @Size(max = 150) String nombreExamen,
        @NotBlank @Size(max = 50) String tipoExamen,
        @NotBlank @Size(max = 200) String motivo,
        @Size(max = 300) String indicaciones,
        @NotBlank @Pattern(regexp = "NORMAL|PRIORITARIO|URGENTE") String prioridad,
        @NotNull Boolean requiereAyuno,
        @Size(max = 300) String observacion
) {
}