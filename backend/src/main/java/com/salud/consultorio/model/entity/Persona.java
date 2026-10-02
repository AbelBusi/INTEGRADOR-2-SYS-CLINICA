package com.salud.consultorio.model.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder(toBuilder = true)
@Entity
@DynamicUpdate
@DynamicInsert
@Table(name = "persona")
public class Persona {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_persona")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_tipo_documento",nullable = false)
    private TipoDocumento tipoDocumento;

    @Column(name = "numero_documento", length = 15, nullable = false, unique = true)
    private String numeroDocumento;

    @Column(name = "nombre", length = 60, nullable = false)
    private String nombre;

    @Column(name = "apellido", length = 100, nullable = false)
    private String apellidos;

    @Column(name = "fec_nacimiento", nullable = false)
    private LocalDate fechaNacimiento;

    @Column(name = "genero", length = 30, nullable = false)
    private String genero;

    @Column(name = "telefono", length = 20, nullable = true)
    private String telefono;

    @Column(name = "direccion", length = 150, nullable = false)
    private String direccion;

    @Column(name = "correo", length = 100, nullable = true, unique = true)
    private String correo;

    @Column(name = "nacionalidad", length = 50, nullable = false)
    private String nacionalidad;

    @CreationTimestamp
    @Column(name = "fec_creacion", nullable = false)
    private LocalDateTime fechaCreacion;

    @UpdateTimestamp
    @Column(name = "fec_actualizacion", nullable = false)
    private LocalDateTime fechaActualizacion;

    @Column(name = "estado", nullable = false)
    @Builder.Default
    private Integer estado = 1;

}