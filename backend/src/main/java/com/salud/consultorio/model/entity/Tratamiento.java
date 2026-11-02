package com.salud.consultorio.model.entity;

import jakarta.persistence.*;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder(toBuilder = true)
@Entity
@Table(name = "tratamiento")
public class Tratamiento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_tratamiento")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_diagnostico", nullable = false)
    private Diagnostico diagnostico;

    @Column(name = "nombre_medicamento", length = 100, nullable = false)
    private String nombreMedicamento;

    @Column(name = "dosis", length = 40, nullable = false)
    private String dosis;

    @Column(name = "via_administracion", length = 30, nullable = false)
    private String viaAdministracion;

    @Column(name = "frecuencia", length = 40, nullable = false)
    private String frecuencia;

    @Column(name = "duracion_dias", nullable = false)
    private Integer duracionDias;

    @Column(name = "tot_cantidad", nullable = false)
    private Integer totCantidad;

    @Column(name = "desc_indicacion", length = 300, nullable = false)
    private String descIndicacion;

    @Column(name = "estado", nullable = false)
    @Builder.Default
    private Integer estado = 1;

}