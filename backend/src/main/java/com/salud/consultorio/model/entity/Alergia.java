package com.salud.consultorio.model.entity;

import com.salud.consultorio.model.enums.TipoAlergia;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder(toBuilder = true)
@DynamicUpdate
@DynamicInsert
@Entity
@Table(name = "alergia")
public class Alergia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_alergia")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_historia_clinica", nullable = false, updatable = false)
    private HistoriaClinica historiaClinica;

    @Column(name = "sustancia", length = 100, nullable = false)
    private String sustancia;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_alergia", length = 20, nullable = false)
    private TipoAlergia tipoAlergia;

    @Column(name = "reaccion", length = 200)
    private String reaccion;

    @Column(name = "observacion", length = 300)
    private String observacion;

    @CreationTimestamp
    @Column(name = "fec_creacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    @UpdateTimestamp
    @Column(name = "fec_actualizacion", nullable = false)
    private LocalDateTime fechaActualizacion;

    @Column(name = "estado", nullable = false)
    @Builder.Default
    private Integer estado = 1;

}