package com.backend.salud.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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

    @Column(name = "clave_acceso",nullable = false)
    private String claveAcceso;

    @Column(name = "estado",nullable = false)
    private Integer estado;

    @OneToMany(mappedBy = "usuario",fetch = FetchType.LAZY)
    private List<Token> token;

}