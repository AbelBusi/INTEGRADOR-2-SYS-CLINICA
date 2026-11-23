package com.salud.consultorio.model.entity;

import com.salud.consultorio.model.enums.Parentesco;
import com.salud.consultorio.model.enums.TipoAntecedenteFamiliar;
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
@Table(name = "antecedente_familiar")
public class AntecedenteFamiliar {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_antecedente_familiar")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_historia_clinica", nullable = false, updatable = false)
    private HistoriaClinica historiaClinica;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo", length = 25, nullable = false)
    private TipoAntecedenteFamiliar tipo;

    @Enumerated(EnumType.STRING)
    @Column(name = "parentesco", length = 20)
    private Parentesco parentesco;

    @Column(name = "descripcion", length = 200, nullable = false)
    private String descripcion;

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