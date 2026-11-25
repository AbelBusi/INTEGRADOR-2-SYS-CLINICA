package com.salud.consultorio.dto.descansoMedico;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record DescansoMedicoCancelarDTO(
        @NotBlank(message = "El motivo de la cancelación es obligatorio")
        @Size(max = 500, message = "El motivo no puede superar los 500 caracteres") String motivo,
        @NotBlank(message = "El código de verificación es obligatorio")
        @Pattern(regexp = "\\d{6}", message = "El código de verificación debe tener 6 dígitos") String codigoVerificacion
) {
}