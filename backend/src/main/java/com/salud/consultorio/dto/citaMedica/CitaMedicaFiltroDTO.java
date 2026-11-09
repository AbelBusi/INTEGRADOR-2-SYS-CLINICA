package com.salud.consultorio.dto.citaMedica;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public record CitaMedicaFiltroDTO(
        String paciente,
        String numeroDocumento,
        Integer idTipoDocumento,
        LocalDate fecha,
        LocalDate fechaDesde,
        LocalDate fechaHasta,
        String turno,
        LocalTime horaDesde,
        LocalTime horaHasta,
        Integer diaSemana,
        List<Integer> estado,
        Boolean enAtencion,
        Integer idEspecialidad,
        Integer idMedico,
        String registradoPor,
        Boolean registroPresencial
) {
}