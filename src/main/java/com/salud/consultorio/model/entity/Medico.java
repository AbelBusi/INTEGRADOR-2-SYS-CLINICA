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
@DynamicUpdate
@DynamicInsert
@Entity
@Table(name = "medico")
public class Medico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_medico")
    private Integer id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_empleado",nullable = false,unique = true)
    private Empleado empleado;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_especialidad",nullable = false)
    private Especialidad especialidad;

    @Column(name = "numero_colegiatura", length = 20, nullable = false)
    private String numeroColegiatura;

    @Column(name = "numero_especialidad", length = 20)
    private String numeroEspecialidad;

    @Column(name = "consejo_regional", length = 60)
    private String consejoRegional;

    @Column(name = "estado", nullable = false)
    @Builder.Default
    private Integer estado = 1;

}