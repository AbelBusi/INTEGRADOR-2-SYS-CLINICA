package com.salud.consultorio.dto.citaMedica;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.time.LocalTime;

public record CitaMedicaCrearDTO(
        @NotNull(message = "El paciente es obligatorio") Integer idPaciente,
        @NotNull(message = "El médico es obligatorio") Integer idMedico,
        @NotNull(message = "El usuario es obligatorio") Integer idUsuario,
        @NotNull(message = "La fecha de la cita es obligatoria") LocalDate fechaCita,
        @NotNull(message = "La hora de inicio es obligatoria") LocalTime horaInicio,
        @NotNull(message = "La hora de salida es obligatoria") LocalTime horaSalida,
        @NotBlank(message = "El motivo es obligatorio")
        @Size(max = 200, message = "El motivo no puede superar los 200 caracteres") String motivo
) {}