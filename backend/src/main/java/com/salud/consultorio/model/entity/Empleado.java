package com.salud.consultorio.model.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder(toBuilder = true)
@DynamicUpdate
@DynamicInsert
@Entity
@Table(name = "empleado")
public class Empleado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_empleado")
    private Integer id;

    @OneToOne(cascade = {CascadeType.PERSIST},fetch = FetchType.LAZY)
    @JoinColumn(name = "id_persona",nullable = false,unique = true)
    private Persona persona;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_cargo",nullable = false)
    private Cargo cargo;

    @CreationTimestamp
    @Column(name = "fec_ingreso",nullable = false)
    private LocalDate fechaIngreso;

    @Column(name = "fec_retiro")
    private LocalDate fechaRetiro;

    @Column(name = "foto", length = 255)
    private String foto;

    @Column(name = "estado", nullable = false)
    @Builder.Default
    private Integer estado = 1;

}