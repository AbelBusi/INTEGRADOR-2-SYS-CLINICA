package com.salud.consultorio.model.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder(toBuilder = true)
@Entity
@DynamicUpdate
@DynamicInsert
@Table(name = "paciente")
public class Paciente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_paciente")
    private Integer id;

    @OneToOne(cascade = {CascadeType.PERSIST},fetch = FetchType.LAZY)
    @JoinColumn(name = "id_persona",nullable = false,unique = true)
    private Persona persona;

    @Column(name = "codigo_asegurado", length = 20, nullable = false,unique = true)
    private String codigoAsegurado;

    @Column(name = "entidad_asegurado", length = 60, nullable = false)
    private String entidadAsegurado;

    @Column(name = "estado",nullable = false)
    @Builder.Default
    private Integer estado = 1;

}