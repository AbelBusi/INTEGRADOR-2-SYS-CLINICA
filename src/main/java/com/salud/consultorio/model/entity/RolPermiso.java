package com.salud.consultorio.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "rol_permiso")
public class RolPermiso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_rol", nullable = false)
    private Rol rol;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_permiso", nullable = false)
    private Permiso permiso;

}