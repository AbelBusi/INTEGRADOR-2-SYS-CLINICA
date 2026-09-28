package com.salud.consultorio.dto.citaMedica;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@NoArgsConstructor
@Getter
@Setter
@Schema(description = "DTO de lectura de información de citas médicas")
public class CitaMedicaLeerDTO {

    @Schema(
            description = "Identificador único de la cita médica",
            example = "1"
    )
    private Integer id;

    @Schema(
            description = "Nombre del paciente",
            example = "María"
    )
    private String nombrePaciente;

    @Schema(
            description = "Apellidos del paciente",
            example = "Gonzales Pérez"
    )
    private String apellidosPaciente;

    @Schema(
            description = "Motivo de la consulta médica",
            example = "Control general"
    )
    private String motivoConsulta;

    @Schema(
            description = "Especialidad médica de la consulta",
            example = "Cardiología"
    )
    private String especialidad;

    @Schema(
            description = "Fecha programada de la consulta",
            example = "2026-05-28"
    )
    private LocalDate diaConsulta;

    @Schema(
            description = "Hora de inicio de la consulta",
            example = "14:00"
    )
    private LocalTime horaInicio;

    @Schema(
            description = "Hora de finalización de la consulta",
            example = "14:30"
    )
    private LocalTime horaSalida;

    @Schema(
            description = "Nombre completo del doctor",
            example = "Carlos Ramírez"
    )
    private String nombreDoctor;

    @Schema(
            description = "Estado actual de la cita médica",
            example = "1"
    )
    private Integer estado;

    public CitaMedicaLeerDTO(
            Integer id,
            String nombrePaciente,
            String apellidosPaciente,
            String motivoConsulta,
            String especialidad,
            LocalDate diaConsulta,
            LocalTime horaInicio,
            LocalTime horaSalida,
            String nombreDoctor,
            Integer estado
    ) {
        this.id = id;
        this.nombrePaciente = nombrePaciente;
        this.apellidosPaciente = apellidosPaciente;
        this.motivoConsulta = motivoConsulta;
        this.especialidad = especialidad;
        this.diaConsulta = diaConsulta;
        this.horaInicio = horaInicio;
        this.horaSalida = horaSalida;
        this.nombreDoctor = nombreDoctor;
        this.estado = estado;
    }
}