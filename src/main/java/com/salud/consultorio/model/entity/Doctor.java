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
@Table(name = "doctor")
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne(cascade = {CascadeType.PERSIST},fetch = FetchType.LAZY)
    @JoinColumn(name = "id_persona",nullable = false)
    private Persona persona;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_especialidad",nullable = false)
    private Especialidad especialidad;

    @Column(name = "cpm", length = 20, nullable = false,unique = true)
    private String cpm;

    @Column(name = "rne", length = 20, nullable = true,unique = true)
    private String rne;

    @Column(name = "consejo_regional", length = 50, nullable = false)
    private String consejoRegional;

    @Column(name = "foto", length = 100, nullable = false)
    private String foto;

    @Column(name = "estado", nullable = false)
    private Integer estado;

    @OneToMany(mappedBy = "doctor",fetch = FetchType.LAZY)
    private List<HorarioAtencion> horarios;

    @OneToMany(mappedBy = "doctor",fetch = FetchType.LAZY)
    private List<CitaMedica> citaMedicas;

}
