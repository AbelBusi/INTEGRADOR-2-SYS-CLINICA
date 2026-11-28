package com.salud.consultorio.dto.examenMedico;

public record ExamenMedicoRespuestaDTO(
        Integer id,
        String nombre,
        String tipoExamen,
        String descripcion,
        Integer estado) {
}
