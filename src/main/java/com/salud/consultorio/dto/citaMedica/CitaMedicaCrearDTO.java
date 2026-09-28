package com.salud.consultorio.dto.citaMedica;

import com.salud.consultorio.dto.recepcionista.RecepcionistaRefCitaMedicaDTO;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Schema(description = "DTO para registrar una cita médica")
public class CitaMedicaCrearDTO {

    @Valid
    @NotNull(message = "El recepcionista es obligatorio")
    @Schema(description = "Recepcionista encargado de registrar la cita")
    private RecepcionistaRefCitaMedicaDTO recepcionista;

    @Valid
    @NotNull(message = "El paciente es obligatorio")
    @Schema(description = "Paciente asignado a la cita médica")
    private PacienteRefCitaMedicaDTO paciente;

    @Valid
    @NotNull(message = "El doctor es obligatorio")
    @Schema(description = "Doctor asignado a la cita médica")
    private DoctorRefCitaMedicaDTO doctor;

    @Valid
    @NotNull(message = "La especialidad es obligatoria")
    @Schema(description = "Especialidad médica relacionada a la cita")
    private EspecialidadRefCitaMedicaDTO especialidad;

    @NotBlank(message = "El motivo es obligatorio")
    @Size(max = 500, message = "El motivo no debe exceder 500 caracteres")
    @Schema(
            description = "Motivo de la consulta médica",
            example = "Dolor abdominal persistente"
    )
    private String motivo;

    @NotNull(message = "La fecha es obligatoria")
    @FutureOrPresent(message = "La fecha no puede ser pasada")
    @Schema(
            description = "Fecha programada para la cita",
            example = "2026-05-20"
    )
    private LocalDate fecha;

    @NotNull(message = "La hora de inicio es obligatoria")
    @Schema(
            description = "Hora de inicio de la cita",
            example = "09:00"
    )
    private LocalTime horaInicio;

    @NotNull(message = "La hora de salida es obligatoria")
    @Schema(
            description = "Hora de finalización de la cita",
            example = "09:30"
    )
    private LocalTime horaSalida;

    @NotNull(message = "El costo es obligatorio")
    @Positive(message = "El costo debe ser mayor a 0")
    @Schema(
            description = "Costo de la consulta médica",
            example = "80.50"
    )
    private Double costo;

    @Schema(
            description = "Estado de la cita médica",
            example = "1"
    )
    private Integer estado;

}