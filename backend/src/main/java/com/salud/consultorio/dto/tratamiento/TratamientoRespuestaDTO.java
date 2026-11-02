package com.salud.consultorio.dto.tratamiento;

public record TratamientoRespuestaDTO(
        Integer id,
        Integer idDiagnostico,
        String nombreMedicamento,
        String dosis,
        String viaAdministracion,
        String frecuencia,
        Integer duracionDias,
        Integer totCantidad,
        String descIndicacion,
        Integer estado
) {
}