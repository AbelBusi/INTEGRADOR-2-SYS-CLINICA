package com.salud.consultorio.dto.horario;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
public class AgendaCitaDTO {

    private LocalDate fecha;
    private LocalTime horaInicio;
    private LocalTime horaFin;
    private String descripcion;

    public AgendaCitaDTO(LocalDate fecha, LocalTime horaInicio, LocalTime horaFin, String descripcion) {
        this.fecha = fecha;
        this.horaInicio = horaInicio;
        this.horaFin = horaFin;
        this.descripcion = descripcion;
    }
}
