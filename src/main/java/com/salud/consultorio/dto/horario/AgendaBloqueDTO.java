package com.salud.consultorio.dto.horario;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
public class AgendaBloqueDTO {

    private Integer diaSemana;
    private LocalTime horaInicio;
    private LocalTime horaFin;

    public AgendaBloqueDTO(Integer diaSemana, LocalTime horaInicio, LocalTime horaFin) {
        this.diaSemana = diaSemana;
        this.horaInicio = horaInicio;
        this.horaFin = horaFin;
    }
}
