package com.salud.consultorio.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "tipo_documento")
public class TipoDocumento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_tipo_documento")
    private Integer idTipoDocumento;

    @Column(name = "codigo", length = 10,nullable = false)
    private String codigo;

    @Column(name = "descripcion", length = 60,nullable = false)
    private String descripcion;

    @Column(name = "estado",nullable = false)
    private Integer estado;

}