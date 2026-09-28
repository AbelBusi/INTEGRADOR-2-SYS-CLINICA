package com.salud.consultorio.dto.permiso;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
@Builder(toBuilder = true)
public class PermisoRespuestaDTO {

    private Integer id;

    private String permiso;

    private String descripcion;

    private Integer estado;

    public PermisoRespuestaDTO(Integer id, String permiso, String descripcion, Integer estado) {
        this.id = id;
        this.permiso = permiso;
        this.descripcion = descripcion;
        this.estado = estado;
    }

}