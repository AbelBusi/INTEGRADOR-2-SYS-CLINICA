package com.salud.consultorio.dto.historiaClinica;

public record TratamientoAtencionDTO(
        Integer id, String nombreMedicamento, String dosis, String viaAdministracion,
        String frecuencia, Integer duracionDias, Integer cantidadTotal, String indicacion
) {}