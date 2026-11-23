package com.salud.consultorio.dto.historiaClinica;

import java.time.LocalDate;

public record PacienteHistoriaDTO(
        Integer idPaciente, String nombreCompleto, String numeroDocumento,
        LocalDate fechaNacimiento, String genero
) {}