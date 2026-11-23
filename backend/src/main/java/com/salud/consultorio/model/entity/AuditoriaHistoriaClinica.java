package com.salud.consultorio.model.entity;

import com.salud.consultorio.model.enums.EntidadAuditoriaHC;
import com.salud.consultorio.model.enums.OperacionAuditoriaHC;
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
@Table(name = "auditoria_historia_clinica")
public class AuditoriaHistoriaClinica {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_auditoria", updatable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_historia_clinica", nullable = false, updatable = false)
    private HistoriaClinica historiaClinica;

    @Enumerated(EnumType.STRING)
    @Column(name = "entidad", length = 25, nullable = false, updatable = false)
    private EntidadAuditoriaHC entidad;

    @Column(name = "id_registro", nullable = false, updatable = false)
    private Integer idRegistro;

    @Enumerated(EnumType.STRING)
    @Column(name = "operacion", length = 15, nullable = false, updatable = false)
    private OperacionAuditoriaHC operacion;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_usuario", nullable = false, updatable = false)
    private Usuario usuario;

    @Column(name = "fecha_evento", nullable = false, updatable = false)
    private LocalDateTime fechaEvento;

    @Column(name = "datos_anteriores", columnDefinition = "LONGTEXT", updatable = false)
    private String datosAnteriores;

    @Column(name = "datos_nuevos", columnDefinition = "LONGTEXT", updatable = false)
    private String datosNuevos;

}