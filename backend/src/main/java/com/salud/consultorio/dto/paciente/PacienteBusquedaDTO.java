package com.salud.consultorio.dto.paciente;

public record PacienteBusquedaDTO(
        Integer idPaciente,

        String nombre,

        String tipoDocumento,

        String numeroDocumento,

        String genero
) {
}