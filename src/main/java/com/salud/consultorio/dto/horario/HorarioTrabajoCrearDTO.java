package com.salud.consultorio.dto.horario;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Schema(description = "DTO para registrar un horario de trabajo")
public class HorarioTrabajoCrearDTO {

    @NotBlank(message = "El tipo es obligatorio")
    @Pattern(regexp = "DOCTOR|RECEPCIONISTA", message = "El tipo debe ser DOCTOR o RECEPCIONISTA")
    @Schema(description = "Tipo de trabajador", example = "DOCTOR")
    private String tipo;

    @NotNull(message = "La referencia del trabajador es obligatoria")
    @Schema(description = "Identificador del doctor o recepcionista", example = "1")
    private Integer referenciaId;

    @NotNull(message = "El día de la semana es obligatorio")
    @Min(value = 1, message = "Día inválido")
    @Max(value = 7, message = "Día inválido")
    @Schema(description = "Día de la semana (1=Lunes ... 7=Domingo)", example = "1")
    private Integer diaSemana;

    @NotNull(message = "La hora de inicio es obligatoria")
    @Schema(description = "Hora de inicio del horario", example = "08:00")
    private LocalTime horaInicio;

    @NotNull(message = "La hora de fin es obligatoria")
    @Schema(description = "Hora de fin del horario", example = "13:00")
    private LocalTime horaFin;

    @Schema(description = "Estado del horario", example = "1")
    private Integer estado;

}
