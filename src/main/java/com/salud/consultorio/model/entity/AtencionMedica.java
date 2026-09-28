package com.salud.consultorio.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;


@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder(toBuilder = true)
@Entity
@Table(name = "atencion_medica")
public class AtencionMedica {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_cita", nullable = false, unique = true)
    private CitaMedica cita;

    @Column(name = "diagnostico", length = 500, nullable = false)
    private String diagnostico;

    @Column(name = "observaciones", length = 1000)
    private String observaciones;

    @Column(name = "tratamiento", length = 1000)
    private String tratamiento;

    @Column(name = "recomendaciones", length = 1000)
    private String recomendaciones;

    @Column(name = "fecha_atencion", nullable = false)
    private LocalDate fechaAtencion;

}
