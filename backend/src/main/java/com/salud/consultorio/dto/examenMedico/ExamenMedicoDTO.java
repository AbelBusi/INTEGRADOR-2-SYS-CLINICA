package com.salud.consultorio.dto.examenMedico;

public record ExamenMedicoDTO(
        Integer id,
        String nombre,
        String tipoExamen,
        String descripcion,
        Integer estado) {
}
