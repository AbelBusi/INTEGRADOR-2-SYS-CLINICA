package com.salud.consultorio.impl;

import com.salud.consultorio.dto.horarioAtencion.*;
import com.salud.consultorio.model.entity.Empleado;
import com.salud.consultorio.model.entity.HorarioAtencion;
import com.salud.consultorio.model.mapper.IHorarioAtencionMapper;
import com.salud.consultorio.repository.IHorarioAtencionRepositorio;
import com.salud.consultorio.service.IEmpleadoServicio;
import com.salud.consultorio.service.IHorarioAtencionServicio;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HorarioAtencionServicioImpl implements IHorarioAtencionServicio {

    private final IHorarioAtencionRepositorio horarioAtencionRepositorio;
    private final IEmpleadoServicio empleadoServicio;
    private final IHorarioAtencionMapper horarioAtencionMapper;

    @Transactional
    @Override
    public HorarioAtencionRespuesta crear(HorarioCrearDTO dto) {

        Empleado empleado = empleadoServicio.entidadPorIDTransaccion(dto.idEmpleado());

        validarHorarios(dto, empleado.getId());

        List<HorarioAtencion> lista = dto.horarios().stream()
                .map(h ->horarioAtencionMapper.toEntity(empleado,h))
                .toList();

        horarioAtencionRepositorio.saveAll(lista);

        return horarioAtencionMapper.toDto(empleado.getId(),dto.horarios());

    }

    @Transactional(readOnly = true)
    @Override
    public EmpleadoHorarioRespuesta obtenerPorID(Integer id) {

        List<HorarioAtencion> horarios = horarioAtencionRepositorio.obtenerHorariosPorEmpleado(id);

        List<HorarioAtencionRespuestaDTO> respuesta = horarios.stream()
                        .map(horarioAtencionMapper::toRespuestaDTO)
                        .toList();

        return new EmpleadoHorarioRespuesta(id, respuesta);

    }

    private void validarHorarios(HorarioCrearDTO dto, Integer idEmpleado) {

        for (HorarioAtencionDTO actual : dto.horarios()) {

            if (!actual.horaEntrada().isBefore(actual.horaSalida())) {
                throw new IllegalArgumentException(
                        "La hora de entrada debe ser menor que la hora de salida"
                );
            }

            boolean existeCruce = horarioAtencionRepositorio.existeCruceHorario(
                    idEmpleado,
                    actual.diaSemana(),
                    actual.horaEntrada(),
                    actual.horaSalida()
            );

            if (existeCruce) {
                throw new IllegalArgumentException(
                        "El empleado ya tiene un horario que se cruza el día "
                                + actual.diaSemana()
                );
            }
        }

        validarCrucesEntreHorarios(dto.horarios());
    }

    private void validarCrucesEntreHorarios(
            List<HorarioAtencionDTO> horarios
    ) {

        for (int i = 0; i < horarios.size(); i++) {

            HorarioAtencionDTO actual = horarios.get(i);

            for (int j = i + 1; j < horarios.size(); j++) {

                HorarioAtencionDTO otro = horarios.get(j);

                if (!actual.diaSemana().equals(otro.diaSemana())) {
                    continue;
                }

                boolean seCruzan =
                        actual.horaEntrada().isBefore(otro.horaSalida())
                                && actual.horaSalida().isAfter(otro.horaEntrada());

                if (seCruzan) {
                    throw new IllegalArgumentException(
                            "Existen horarios cruzados para el día "
                                    + actual.diaSemana()
                    );
                }
            }
        }
    }

}