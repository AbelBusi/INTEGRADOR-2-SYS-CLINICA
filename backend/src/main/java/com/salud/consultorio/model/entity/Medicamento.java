package com.salud.consultorio.model.entity;

import com.salud.consultorio.model.enums.GrupoTerapeutico;
import com.salud.consultorio.model.enums.IndicacionTerapeutica;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "medicamento",
        indexes = @Index(name = "idx_medicamento_nombre_normalizado", columnList = "nombre_normalizado")
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Medicamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 150)
    private String nombre;

    /** Clave para detectar duplicados y nombres parecidos. */
    @Column(name = "nombre_normalizado", nullable = false, length = 150)
    private String nombreNormalizado;

    @Column(name = "principio_activo", length = 150)
    private String principioActivo;

    @Column(length = 60)
    private String concentracion;

    @Column(name = "concentracion_normalizada", nullable = false, length = 60)
    private String concentracionNormalizada;

    @Enumerated(EnumType.STRING)
    @Column(name = "grupo_terapeutico", nullable = false, length = 40)
    private GrupoTerapeutico grupoTerapeutico;

    @Enumerated(EnumType.STRING)
    @Column(name = "indicacion_terapeutica", length = 40)
    private IndicacionTerapeutica indicacionTerapeutica;

    @Column(length = 100)
    private String laboratorio;

    @Column(length = 255)
    private String descripcion;

    @Column(name = "requiere_receta", nullable = false)
    private Boolean requiereReceta;

    /** Ruta de la imagen referencial (ej. /uploads/MEDICAMENTOS/uuid.png). */
    @Column(length = 255)
    private String foto;

    @Column(nullable = false)
    @Builder.Default
    private Integer estado = 1;

    @CreationTimestamp
    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    @UpdateTimestamp
    @Column(name = "fecha_actualizacion", nullable = false)
    private LocalDateTime fechaActualizacion;
}