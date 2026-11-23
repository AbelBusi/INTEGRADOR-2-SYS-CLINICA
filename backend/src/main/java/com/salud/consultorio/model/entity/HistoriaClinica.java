package com.salud.consultorio.model.entity;

import com.salud.consultorio.model.enums.FactorRh;
import com.salud.consultorio.model.enums.GrupoSanguineo;
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
@Table(name = "historia_clinica")
public class HistoriaClinica {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_historia_clinica")
    private Integer id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_paciente", nullable = false, unique = true, updatable = false)
    private Paciente paciente;

    @Column(name = "numero_historia", length = 15, nullable = false, unique = true, updatable = false)
    private String numeroHistoria;

    @Enumerated(EnumType.STRING)
    @Column(name = "grupo_sanguineo", length = 2)
    private GrupoSanguineo grupoSanguineo;

    @Enumerated(EnumType.STRING)
    @Column(name = "factor_rh", length = 8)
    private FactorRh factorRh;

    @Column(name = "observaciones", length = 500)
    private String observaciones;

    // Control de concurrencia: dos médicos no pisan cambios entre sí
    @Version
    @Column(name = "version", nullable = false)
    private Integer version;

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