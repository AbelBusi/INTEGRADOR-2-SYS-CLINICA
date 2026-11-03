package com.salud.consultorio.model.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Entity
@Table(name = "intento_autorregistro")
public class IntentoAutorregistro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_intento_autorregistro")
    private Integer id;

    @Column(name = "id_persona", nullable = false)
    private Integer idPersona;

    @CreationTimestamp
    @Column(name = "fec_intento", nullable = false)
    private LocalDateTime fechaIntento;
}