package com.salud.consultorio.model.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
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
    @Column(name = "id_usuario")
    private Integer id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_persona",nullable = false)
    private Persona persona;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_rol",nullable = false)
    private Rol rol;

    @Column(name = "usuario",nullable = false, length = 30)
    private String usuario;

    @Column(name = "clave",nullable = false, length = 255)
    private String claveAcceso;

    @CreationTimestamp
    @Column(name = "fec_creacion", nullable = false)
    private LocalDateTime fechaCreacion;

    @UpdateTimestamp
    @Column(name = "fec_actualizacion", nullable = false)
    private LocalDateTime fechaActualizacion;

    @Column(name = "requiere_cambio_clave", nullable = false)
    private boolean requiereCambioClave;

    @Column(name = "estado",nullable = false)
    private Integer estado;

    @OneToMany(mappedBy = "usuario",fetch = FetchType.LAZY)
    private List<Token> token;

}