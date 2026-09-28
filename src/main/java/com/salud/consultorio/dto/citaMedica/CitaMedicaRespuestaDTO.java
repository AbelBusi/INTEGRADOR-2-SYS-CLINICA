package com.salud.consultorio.dto.citaMedica;

 import com.salud.consultorio.dto.recepcionista.RecepcionistaRefCitaMedicaDTO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CitaMedicaRespuestaDTO {

    private Integer id;

    private RecepcionistaRefCitaMedicaDTO recepcionista;

    private PacienteRefCitaMedicaDTO paciente;

    private DoctorRefCitaMedicaDTO doctor;

    private EspecialidadRefCitaMedicaDTO especialidad;

    private String motivo;

    private LocalDate fecha;

    private LocalTime horaInicio;

    private LocalTime horaSalida;

    private Double costo;

    private Integer estado;

}