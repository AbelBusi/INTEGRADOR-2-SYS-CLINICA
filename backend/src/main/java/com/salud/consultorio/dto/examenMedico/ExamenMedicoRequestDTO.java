package com.salud.consultorio.dto.examenMedico;

public record ExamenMedicoRequestDTO(
        String nombre,
        String tipoExamen,
        String descripcion) {
}
