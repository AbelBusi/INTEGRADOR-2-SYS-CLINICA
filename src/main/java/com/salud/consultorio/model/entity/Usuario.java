package com.salud.consultorio.model.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;


@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "usuario")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_persona",nullable = false)
    private Persona persona;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_rol",nullable = false)
    private Rol rol;

    @Column(name = "usuario",nullable = false)
    private String usuario;

    @CreationTimestamp
    @Column(name = "fecha_creacion", nullable = false)
    private LocalDate fechaCreacion;

    @UpdateTimestamp
    @Column(name = "fecha_actualizacion", nullable = false)
    private LocalDate fechaActualizacion;

    @Column(name = "requiere_cambio_password", nullable = false)
    private boolean requiereCambioPassword;

    @Column(name = "clave_acceso",nullable = false)
    private String claveAcceso;

    @Column(name = "estado",nullable = false)
    private Integer estado;

    @OneToMany(mappedBy = "usuario",fetch = FetchType.LAZY)
    private List<Token> token;

}