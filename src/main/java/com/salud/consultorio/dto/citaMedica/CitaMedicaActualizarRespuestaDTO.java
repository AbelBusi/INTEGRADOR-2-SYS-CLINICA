package com.salud.consultorio.dto.citaMedica;

import com.salud.consultorio.dto.recepcionista.RecepcionistaRefCitaMedicaDTO;
import io.swagger.v3.oas.annotations.media.Schema;
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
@Schema(description = "DTO de respuesta para la actualización de una cita médica")
public class CitaMedicaActualizarRespuestaDTO {

    @Schema(
            description = "Identificador único de la cita médica",
            example = "1"
    )
    private Integer id;

    @Schema(description = "Recepcionista encargado de la actualización")
    private RecepcionistaRefCitaMedicaDTO recepcionista;

    @Schema(description = "Paciente asociado a la cita médica")
    private PacienteRefCitaMedicaDTO paciente;

    @Schema(description = "Doctor asignado a la cita médica")
    private DoctorRefCitaMedicaDTO doctor;

    @Schema(description = "Especialidad médica de la consulta")
    private EspecialidadRefCitaMedicaDTO especialidad;

    @Schema(
            description = "Motivo actualizado de la consulta médica",
            example = "Evaluación médica general"
    )
    private String motivo;

    @Schema(
            description = "Fecha programada de la cita médica",
            example = "2026-05-30"
    )
    private LocalDate fecha;

    @Schema(
            description = "Hora de inicio de la cita",
            example = "11:00"
    )
    private LocalTime horaInicio;

    @Schema(
            description = "Hora de finalización de la cita",
            example = "11:30"
    )
    private LocalTime horaSalida;

    @Schema(
            description = "Costo de la consulta médica",
            example = "100.00"
    )
    private Double costo;

    @Schema(
            description = "Estado actual de la cita médica",
            example = "1"
    )
    private Integer estado;

}