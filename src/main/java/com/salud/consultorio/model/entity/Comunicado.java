package com.salud.consultorio.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;


@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder(toBuilder = true)
@Entity
@Table(name = "comunicado")
public class Comunicado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "titulo", length = 150, nullable = false)
    private String titulo;

    @Column(name = "mensaje", length = 1000, nullable = false)
    private String mensaje;

    @Column(name = "fecha", nullable = false)
    private LocalDate fecha;

    @Column(name = "estado", nullable = false)
    private Integer estado;

}
