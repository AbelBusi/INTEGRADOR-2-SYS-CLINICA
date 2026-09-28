package com.salud.consultorio.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;


@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder(toBuilder = true)
@Entity
@Table(name = "especialidad")
public class Especialidad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "nombre", length = 40, nullable = false, unique = true)
    private String nombre;

    @Column(name = "descripcion", length = 100, nullable = false)
    private String descripcion;

    @Column(name = "estado",nullable = false)
    private Integer estado;

    @OneToMany(mappedBy = "especialidad",fetch = FetchType.LAZY)
    private List<Doctor> doctores;

    @OneToMany(mappedBy = "especialidad",fetch = FetchType.LAZY)
    private List<CitaMedica> citaMedicas;

}