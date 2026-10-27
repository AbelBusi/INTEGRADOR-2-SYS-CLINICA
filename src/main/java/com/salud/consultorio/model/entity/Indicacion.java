package com.salud.consultorio.model.entity;

import jakarta.persistence.*;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder(toBuilder = true)
@Entity
@Table(name = "indicacion")
public class Indicacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_indicacion")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_diagnostico", nullable = false)
    private Diagnostico diagnostico;

    @Column(name = "tipo_indicacion", length = 30, nullable = false)
    private String tipoIndicacion;

    @Column(name = "descripcion", length = 300, nullable = false)
    private String descripcion;

    @Column(name = "dias_reposo", nullable = false)
    private Integer diasReposo;

    @Column(name = "frecuencia", length = 40, nullable = false)
    private String frecuencia;

    @Column(name = "estado", nullable = false)
    @Builder.Default
    private Integer estado = 1;

}