package com.salud.consultorio.dto.usuario;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UsuarioRolDTO {

    private String nombres;
    private String rol;

    public UsuarioRolDTO(String nombres, String rol) {
        this.nombres = nombres;
        this.rol = rol;
    }
}
