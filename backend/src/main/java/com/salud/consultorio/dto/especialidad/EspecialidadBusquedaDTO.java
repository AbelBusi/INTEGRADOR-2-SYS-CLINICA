package com.salud.consultorio.dto.especialidad;

public record EspecialidadBusquedaDTO(
        Integer id,
        String nombre,
        Long cantidadMedicos
) {}