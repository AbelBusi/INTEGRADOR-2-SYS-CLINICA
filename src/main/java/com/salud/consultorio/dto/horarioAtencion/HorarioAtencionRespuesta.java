package com.salud.consultorio.dto.horarioAtencion;

import com.salud.consultorio.model.entity.HorarioAtencion;

import java.util.List;

public record HorarioAtencionRespuesta(

        Integer idEmpleado,

        List<HorarioAtencion> horarios

) {
}