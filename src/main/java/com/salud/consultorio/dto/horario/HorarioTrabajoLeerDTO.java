package com.salud.consultorio.dto.horario;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@Schema(description = "DTO de lectura de horarios de trabajo")
public class HorarioTrabajoLeerDTO {

    private Integer id;
    private Integer personaId;
    private String nombreCompleto;
    private String tipo;
    private Integer diaSemana;
    private LocalTime horaInicio;
    private LocalTime horaFin;
    private Integer estado;

    public HorarioTrabajoLeerDTO(
            Integer id,
            Integer personaId,
            String nombreCompleto,
            String tipo,
            Integer diaSemana,
            LocalTime horaInicio,
            LocalTime horaFin,
            Integer estado
    ) {
        this.id = id;
        this.personaId = personaId;
        this.nombreCompleto = nombreCompleto;
        this.tipo = tipo;
        this.diaSemana = diaSemana;
        this.horaInicio = horaInicio;
        this.horaFin = horaFin;
        this.estado = estado;
    }
}
