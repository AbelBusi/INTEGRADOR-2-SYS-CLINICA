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
@Table(name = "recepcionista")
public class Recepcionista {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "id_persona",nullable = false,unique = true)
    private Persona persona;

    @Column(name = "codigo_empleado", length = 25, nullable = false, unique = true)
    private String codigoEmpleado;

    @Column(name = "estado",nullable = false)
    private Integer estado;

    @OneToMany(mappedBy = "recepcionista",fetch = FetchType.LAZY)
    private List<CitaMedica> citas;

}