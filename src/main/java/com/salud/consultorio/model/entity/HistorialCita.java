package com.salud.consultorio.model.entity;

import com.salud.consultorio.model.enums.AccionHistorialCita;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Immutable;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Immutable
@Entity
@Table(name = "historial_cita")
public class HistorialCita {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_historial_cita", updatable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_cita_medica", nullable = false, updatable = false)
    private CitaMedica cita;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_usuario", updatable = false)
    private Usuario usuario;

    @Enumerated(EnumType.STRING)
    @Column(name = "accion", nullable = false, length = 20, updatable = false)
    private AccionHistorialCita accion;

    @Column(name = "fecha_evento", nullable = false, updatable = false)
    private LocalDateTime fechaEvento;

    @Column(name = "datos_anteriores", columnDefinition = "LONGTEXT", updatable = false)
    private String datosAnteriores;

    @Column(name = "datos_nuevos", columnDefinition = "LONGTEXT", updatable = false)
    private String datosNuevos;

    @Column(name = "observacion", length = 300, updatable = false)
    private String observacion;

}