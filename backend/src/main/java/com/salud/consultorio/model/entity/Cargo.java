package com.salud.consultorio.model.entity;

import jakarta.persistence.*;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Builder(toBuilder = true)
@Getter
@Setter
@Entity
@Table(name = "cargo")
public class Cargo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cargo")
    private Integer id;

    @Column(name = "nombre", nullable = false, length = 60, unique = true)
    private String nombre;

    @Column(name = "descripcion", nullable = false, length = 200)
    private String descripcion;

    @Column(name = "es_personal_medico", nullable = false)
    private boolean esPersonalMedico;

    @Column(name = "estado", nullable = false)
    @Builder.Default
    private Integer estado = 1;

}