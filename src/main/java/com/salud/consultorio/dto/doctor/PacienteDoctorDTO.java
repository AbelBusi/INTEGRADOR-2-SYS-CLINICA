package com.salud.consultorio.dto.doctor;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PacienteDoctorDTO {

    private Integer id;
    private String dni;
    private String nombre;
    private String apellidos;

    public PacienteDoctorDTO(Integer id, String dni, String nombre, String apellidos) {
        this.id = id;
        this.dni = dni;
        this.nombre = nombre;
        this.apellidos = apellidos;
    }
}
