package com.salud.consultorio.dto.citaMedica;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
public class PacienteCitaDTO {

    private Integer citaId;
    private String doctor;
    private String especialidad;
    private LocalDate fecha;
    private LocalTime horaInicio;
    private LocalTime horaSalida;
    private Integer estado;
    private String recepcionista;

    public PacienteCitaDTO(
            Integer citaId,
            String doctor,
            String especialidad,
            LocalDate fecha,
            LocalTime horaInicio,
            LocalTime horaSalida,
            Integer estado,
            String recepcionista
    ) {
        this.citaId = citaId;
        this.doctor = doctor;
        this.especialidad = especialidad;
        this.fecha = fecha;
        this.horaInicio = horaInicio;
        this.horaSalida = horaSalida;
        this.estado = estado;
        this.recepcionista = recepcionista;
    }
}
