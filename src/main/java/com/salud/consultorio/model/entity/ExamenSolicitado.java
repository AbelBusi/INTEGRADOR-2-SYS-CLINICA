package com.salud.consultorio.model.entity;

import jakarta.persistence.*;
import lombok.*;

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

    @Column(name = "motivo", length = 200, nullable = false)
    private String motivo;

    @Column(name = "estado", nullable = false)
    @Builder.Default
    private Integer estado = 1;

}