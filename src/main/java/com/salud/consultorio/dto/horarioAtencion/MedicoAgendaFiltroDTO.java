package com.salud.consultorio.dto.horarioAtencion;

public record MedicoAgendaFiltroDTO(
        Integer idEmpleado,
        String nombre,
        Integer idCargo,
        String cargo
) {}