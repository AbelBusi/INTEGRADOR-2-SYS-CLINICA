package com.salud.consultorio.dto.descansoMedico;

import jakarta.validation.constraints.*;

import java.time.LocalDate;

public record DescansoMedicoCrearDTO(
        @NotNull(message = "La fecha de inicio es obligatoria") LocalDate fechaInicio,
        @NotNull(message = "La fecha de fin es obligatoria") LocalDate fechaFin,
        @NotNull(message = "La cantidad de días es obligatoria")
        @Min(value = 1, message = "La cantidad de días debe ser al menos 1") Integer dias,
        @NotBlank(message = "La justificación médica es obligatoria")
        @Size(max = 1000, message = "La justificación no puede superar los 1000 caracteres") String justificacion,
        @NotBlank(message = "El código de verificación es obligatorio")
        @Pattern(regexp = "\\d{6}", message = "El código de verificación debe tener 6 dígitos") String codigoVerificacion
) {
}