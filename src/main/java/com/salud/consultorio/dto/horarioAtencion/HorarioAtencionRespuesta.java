package com.salud.consultorio.dto.horarioAtencion;

import java.util.List;

public record HorarioAtencionRespuesta(
        Integer idEmpleado,
        List<HorarioAtencionRespuestaDTO> horarios
) {}