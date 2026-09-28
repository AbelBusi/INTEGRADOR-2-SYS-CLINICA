package com.salud.consultorio.dto.comunicado;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
public class ComunicadoLeerDTO {

    private Integer id;
    private String titulo;
    private String mensaje;
    private LocalDate fecha;

    public ComunicadoLeerDTO(Integer id, String titulo, String mensaje, LocalDate fecha) {
        this.id = id;
        this.titulo = titulo;
        this.mensaje = mensaje;
        this.fecha = fecha;
    }
}
