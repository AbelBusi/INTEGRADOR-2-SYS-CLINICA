package com.salud.consultorio.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalTime;


@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder(toBuilder = true)
@Entity
@Table(name = "horario_trabajo")
public class HorarioTrabajo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_persona", nullable = false)
    private Persona persona;

    @Column(name = "tipo", length = 20, nullable = false)
    private String tipo;

    @Column(name = "dia_semana", nullable = false)
    private Integer diaSemana;

    @Column(name = "hora_inicio", nullable = false)
    private LocalTime horaInicio;

    @Column(name = "hora_fin", nullable = false)
    private LocalTime horaFin;

    @Column(name = "estado", nullable = false)
    private Integer estado;

}
