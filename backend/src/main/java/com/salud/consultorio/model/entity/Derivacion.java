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
@Table(name = "derivacion")
public class Derivacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_derivacion")
    private Integer id;

    @Column(name = "codigo", length = 15, nullable = false, unique = true)
    private String codigo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_diagnostico", nullable = false)
    private Diagnostico diagnostico;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_especialidad", nullable = false)
    private Especialidad especialidad;

    @Column(name = "motivo", length = 200, nullable = false)
    private String motivo;

    @Column(name = "urgencia", nullable = false)
    @Builder.Default
    private Integer urgencia = 1;

    @Column(name = "fecha_derivacion", nullable = false, updatable = false)
    private LocalDateTime fechaDerivacion;

    @Column(name = "id_cita_medica")
    private Integer idCitaMedica;

    @Column(name = "estado", nullable = false)
    @Builder.Default
    private Integer estado = 1;

    @PrePersist
    void alPersistir() {
        if (fechaDerivacion == null) {
            fechaDerivacion = LocalDateTime.now();
        }
    }

}