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
@Table(name = "examen_solicitado")
public class ExamenSolicitado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_examen_solicitado")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_diagnostico", nullable = false)
    private Diagnostico diagnostico;

    @Column(name = "nombre_examen", length = 150, nullable = false)
    private String nombreExamen;

    @Column(name = "tipo_examen", length = 50, nullable = false)
    private String tipoExamen;

    @Column(name = "motivo", length = 200, nullable = false)
    private String motivo;

    @Column(name = "indicaciones", length = 300)
    private String indicaciones;

    @Column(name = "prioridad", length = 20, nullable = false)
    @Builder.Default
    private String prioridad = "NORMAL";

    @Column(name = "requiere_ayuno", nullable = false)
    @Builder.Default
    private Boolean requiereAyuno = false;

    @Column(name = "fecha_solicitud", nullable = false)
    private LocalDateTime fechaSolicitud;

    @Column(name = "observacion", length = 300)
    private String observacion;

    @Column(name = "estado", nullable = false)
    @Builder.Default
    private Integer estado = 1;

}