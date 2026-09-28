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
@Table(name = "paciente")
public class Paciente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne(cascade = {CascadeType.PERSIST},fetch = FetchType.LAZY)
    @JoinColumn(name = "id_persona",nullable = false,unique = true)
    private Persona persona;

    @Column(name = "entidad_aseguradora", length = 8, nullable = false)
    private String entidadAseguradora;

    @Column(name = "codigo_aseguradora", length = 20, nullable = false,unique = true)
    private String codigoAseguradora;

    @Column(name = "estado",nullable = false)
    private Integer estado;

    @OneToMany(mappedBy = "paciente",fetch = FetchType.LAZY)
    private List<CitaMedica> citaMedicas;

}