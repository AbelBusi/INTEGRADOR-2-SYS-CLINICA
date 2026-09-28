package com.salud.consultorio.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;


@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Builder(toBuilder = true)
@Table(name = "cita_medica")
public class CitaMedica {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY,cascade = {CascadeType.PERSIST})
    @JoinColumn(name = "id_recepcionista",nullable = false)
    private Recepcionista recepcionista;

    @ManyToOne(fetch = FetchType.LAZY,cascade = {CascadeType.PERSIST})
    @JoinColumn(name = "id_paciente",nullable = false)
    private Paciente paciente;

    @ManyToOne(fetch = FetchType.LAZY,cascade = {CascadeType.PERSIST})
    @JoinColumn(name = "id_doctor",nullable = false)
    private Doctor doctor;

    @ManyToOne(fetch = FetchType.LAZY,cascade = {CascadeType.PERSIST})
    @JoinColumn(name = "id_especialidad",nullable = false)
    private Especialidad especialidad;

    @Column(name = "motivo", length = 500, nullable = false)
    private String motivo;

    @Column(name = "fecha",nullable = false)
    private LocalDate fecha;

    @Column(name = "hora_inicio",nullable = false)
    private LocalTime horaInicio;

    @Column(name = "hora_salida",nullable = false)
    private LocalTime horaSalida;

    @Column(name = "costo",precision = 2,nullable = false)
    private Double costo;

    @Column(name = "estado",nullable = false)
    private Integer estado;

}