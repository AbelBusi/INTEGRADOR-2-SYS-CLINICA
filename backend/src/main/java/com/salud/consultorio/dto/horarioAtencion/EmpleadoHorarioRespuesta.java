package com.salud.consultorio.dto.horarioAtencion;

import java.util.List;

public record EmpleadoHorarioRespuesta(
        Integer idEmpleado,
        List<HorarioAtencionRespuestaDTO> horarios
) {}