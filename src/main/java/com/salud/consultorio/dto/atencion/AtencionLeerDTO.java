package com.salud.consultorio.dto.atencion;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
public class AtencionLeerDTO {

    private Integer id;
    private Integer citaId;
    private LocalDate fechaAtencion;
    private String doctor;
    private String especialidad;
    private String motivo;
    private String diagnostico;
    private String observaciones;
    private String tratamiento;
    private String recomendaciones;

    public AtencionLeerDTO(
            Integer id,
            Integer citaId,
            LocalDate fechaAtencion,
            String doctor,
            String especialidad,
            String motivo,
            String diagnostico,
            String observaciones,
            String tratamiento,
            String recomendaciones
    ) {
        this.id = id;
        this.citaId = citaId;
        this.fechaAtencion = fechaAtencion;
        this.doctor = doctor;
        this.especialidad = especialidad;
        this.motivo = motivo;
        this.diagnostico = diagnostico;
        this.observaciones = observaciones;
        this.tratamiento = tratamiento;
        this.recomendaciones = recomendaciones;
    }
}
