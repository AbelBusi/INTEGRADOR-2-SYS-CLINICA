package com.salud.consultorio.dto.citaMedica;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
public class DoctorCitaDTO {

    private Integer citaId;
    private Integer pacienteId;
    private String dni;
    private String nombrePaciente;
    private String motivo;
    private String especialidad;
    private LocalDate fecha;
    private LocalTime horaInicio;
    private LocalTime horaSalida;
    private Integer estado;

    public DoctorCitaDTO(
            Integer citaId,
            Integer pacienteId,
            String dni,
            String nombrePaciente,
            String motivo,
            String especialidad,
            LocalDate fecha,
            LocalTime horaInicio,
            LocalTime horaSalida,
            Integer estado
    ) {
        this.citaId = citaId;
        this.pacienteId = pacienteId;
        this.dni = dni;
        this.nombrePaciente = nombrePaciente;
        this.motivo = motivo;
        this.especialidad = especialidad;
        this.fecha = fecha;
        this.horaInicio = horaInicio;
        this.horaSalida = horaSalida;
        this.estado = estado;
    }
}
