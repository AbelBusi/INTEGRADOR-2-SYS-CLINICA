package com.salud.consultorio.dto.historiaClinica;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

public record AtencionHistoriaDTO(
        Integer idCita, LocalDate fechaCita, LocalTime horaInicio, LocalTime horaSalida,
        LocalDateTime inicioAtencion, LocalDateTime finAtencion,
        Integer idMedico, String medico, String especialidad, String motivo,
        List<DiagnosticoAtencionDTO> diagnosticos
) {}