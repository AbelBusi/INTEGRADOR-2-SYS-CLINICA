package com.salud.consultorio.dto.historiaClinica;

public record IndicacionAtencionDTO(
        Integer id, String tipoIndicacion, String descripcion, Integer diasReposo, String frecuencia
) {}