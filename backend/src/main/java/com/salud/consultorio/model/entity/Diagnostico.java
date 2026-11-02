package com.salud.consultorio.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder(toBuilder = true)
@Entity
@Table(name = "diagnostico")
public class Diagnostico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_diagnostico")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_cita_medica", nullable = false)
    private CitaMedica citaMedica;

    @Column(name = "codigo", length = 15, nullable = false)
    private String codigo;

    @Column(name = "descripcion", length = 300, nullable = false)
    private String descripcion;

    @Column(name = "tipo_diagnostico", nullable = false)
    private Integer tipoDiagnostico;

    @Column(name = "observaciones", length = 300, nullable = false)
    private String observaciones;

    @Column(name = "fec_diagnostico", nullable = false)
    private LocalDateTime fecDiagnostico;

    @Column(name = "estado", nullable = false)
    @Builder.Default
    private Integer estado = 1;

}