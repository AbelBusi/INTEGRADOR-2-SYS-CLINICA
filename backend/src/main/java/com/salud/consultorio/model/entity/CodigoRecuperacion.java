package com.salud.consultorio.model.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Entity
@Table(name = "codigo_recuperacion")
public class CodigoRecuperacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_codigo")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @Column(name = "codigo_hash", nullable = false, length = 255)
    private String codigoHash;

    @Column(name = "fec_expiracion", nullable = false)
    private LocalDateTime fechaExpiracion;

    @Column(name = "intentos", nullable = false)
    private int intentos;

    @Column(name = "usado", nullable = false)
    private boolean usado;

    @CreationTimestamp
    @Column(name = "fec_creacion", nullable = false)
    private LocalDateTime fechaCreacion;
}