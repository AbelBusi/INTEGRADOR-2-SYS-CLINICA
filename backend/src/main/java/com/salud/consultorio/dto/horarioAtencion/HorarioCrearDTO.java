package com.salud.consultorio.dto.horarioAtencion;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.List;

@Schema(description = "DTO para registrar los horarios de atención de un empleado")
public record HorarioCrearDTO(

        @NotNull(message = "El empleado es obligatorio")
        @Schema(description = "ID del empleado al que pertenecen los horarios", example = "15")
        Integer idEmpleado,

        @NotNull(message = "La fecha de inicio es obligatoria")
        @Schema(description = "Primer día en que rigen los horarios", example = "2026-10-05")
        LocalDate fechaInicio,

        @NotNull(message = "La fecha de fin es obligatoria")
        @Schema(description = "Último día en que rigen los horarios", example = "2026-12-31")
        LocalDate fechaFin,

        @NotEmpty(message = "Debe registrar al menos un horario")
        @Valid
        @Schema(description = "Lista de horarios de atención del empleado")
        List<HorarioAtencionDTO> horarios

) {}