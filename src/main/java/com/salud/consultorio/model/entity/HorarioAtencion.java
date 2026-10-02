package com.salud.consultorio.model.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import java.time.LocalTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder(toBuilder = true)
@Entity
@DynamicUpdate
@DynamicInsert
@ToString
@Table(name = "horario_atencion")
public class HorarioAtencion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_horario_atencion")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_empleado", nullable = false)
    private Empleado empleado;

    @Column(name = "dia_semana", nullable = false)
    private Integer diaSemana;

    @Column(name = "hora_entrada", nullable = false)
    private LocalTime horaEntrada;

    @Column(name = "hora_salida", nullable = false)
    private LocalTime horaSalida;

    @Column(name = "estado", nullable = false)
    @Builder.Default
    private Integer estado = 1;

}