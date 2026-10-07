package com.salud.consultorio.impl;

import com.salud.consultorio.dto.horarioAtencion.*;
import com.salud.consultorio.model.entity.Empleado;
import com.salud.consultorio.model.entity.HorarioAtencion;
import com.salud.consultorio.model.mapper.IHorarioAtencionMapper;
import com.salud.consultorio.repository.IHorarioAtencionRepositorio;
import com.salud.consultorio.service.IEmpleadoServicio;
import com.salud.consultorio.service.IHorarioAtencionServicio;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HorarioAtencionServicioImpl implements IHorarioAtencionServicio {

    private static final int SIN_EXCLUSION = -1;

    private final IHorarioAtencionRepositorio horarioAtencionRepositorio;
    private final IEmpleadoServicio empleadoServicio;
    private final IHorarioAtencionMapper horarioAtencionMapper;

    @Transactional
    @Override
    public HorarioAtencionRespuesta crear(HorarioCrearDTO dto) {

        Empleado empleado = empleadoServicio.entidadPorIDTransaccion(dto.idEmpleado());

        validarVigencia(dto.fechaInicio(), dto.fechaFin());

        for (HorarioAtencionDTO actual : dto.horarios()) {
            validarRangoHoras(actual.horaEntrada(), actual.horaSalida());
            validarCruceConExistentes(
                    empleado.getId(),
                    actual.diaSemana(),
                    actual.horaEntrada(),
                    actual.horaSalida(),
                    dto.fechaInicio(),
                    dto.fechaFin(),
                    SIN_EXCLUSION
            );
        }

        validarCrucesEntreHorarios(dto.horarios());

        List<HorarioAtencion> lista = dto.horarios().stream()
                .map(h -> horarioAtencionMapper.toEntity(
                        empleado, h, dto.fechaInicio(), dto.fechaFin()))
                .toList();

        List<HorarioAtencion> guardados = horarioAtencionRepositorio.saveAll(lista);

        return horarioAtencionMapper.toDto(empleado.getId(), guardados);

    }

    @Transactional
    @Override
    public HorarioAtencionRespuestaDTO actualizar(Integer idHorario, HorarioActualizarDTO dto) {

        HorarioAtencion horario = obtenerActivo(idHorario);

        validarVigencia(dto.fechaInicio(), dto.fechaFin());
        validarRangoHoras(dto.horaEntrada(), dto.horaSalida());
        validarCruceConExistentes(
                horario.getEmpleado().getId(),
                dto.diaSemana(),
                dto.horaEntrada(),
                dto.horaSalida(),
                dto.fechaInicio(),
                dto.fechaFin(),
                horario.getId()
        );

        horarioAtencionMapper.actualizar(dto, horario);

        return horarioAtencionMapper.toRespuestaDTO(horarioAtencionRepositorio.save(horario));

    }

    @Transactional
    @Override
    public void eliminarPorId(Integer idHorario) {

        HorarioAtencion horario = obtenerActivo(idHorario);

        horario.setEstado(0);

        horarioAtencionRepositorio.save(horario);

    }

    @Transactional(readOnly = true)
    @Override
    public EmpleadoHorarioRespuesta obtenerPorID(Integer id) {

        List<HorarioAtencionRespuestaDTO> respuesta = horarioAtencionRepositorio
                .obtenerHorariosPorEmpleado(id).stream()
                .map(horarioAtencionMapper::toRespuestaDTO)
                .toList();

        return new EmpleadoHorarioRespuesta(id, respuesta);

    }

    @Transactional(readOnly = true)
    @Override
    public List<HorarioAtencionResumenDTO> lista() {
        return horarioAtencionRepositorio.obtenerTodosLosHorarios();
    }

    private HorarioAtencion obtenerActivo(Integer idHorario) {

        HorarioAtencion horario = horarioAtencionRepositorio.findById(idHorario)
                .orElseThrow(() -> new EntityNotFoundException("Horario no encontrado"));

        if (horario.getEstado() == 0) {
            throw new IllegalArgumentException("El horario ya se encuentra eliminado");
        }

        return horario;
    }

    private void validarVigencia(LocalDate fechaInicio, LocalDate fechaFin) {
        if (fechaFin.isBefore(fechaInicio)) {
            throw new IllegalArgumentException(
                    "La fecha de fin no puede ser anterior a la fecha de inicio"
            );
        }
    }

    private void validarRangoHoras(LocalTime horaEntrada, LocalTime horaSalida) {
        if (!horaEntrada.isBefore(horaSalida)) {
            throw new IllegalArgumentException(
                    "La hora de entrada debe ser menor que la hora de salida"
            );
        }
    }

    private void validarCruceConExistentes(
            Integer idEmpleado,
            Integer diaSemana,
            LocalTime horaEntrada,
            LocalTime horaSalida,
            LocalDate fechaInicio,
            LocalDate fechaFin,
            Integer idExcluir
    ) {

        boolean existeCruce = horarioAtencionRepositorio.existeCruceHorario(
                idEmpleado,
                diaSemana,
                horaEntrada,
                horaSalida,
                fechaInicio,
                fechaFin,
                idExcluir
        );

        if (existeCruce) {
            throw new IllegalArgumentException(
                    "El empleado ya tiene un horario que se cruza el día " + diaSemana
                            + " dentro del periodo indicado"
            );
        }
    }

    private void validarCrucesEntreHorarios(List<HorarioAtencionDTO> horarios) {

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
                            "Existen horarios cruzados para el día " + actual.diaSemana()
                    );
                }
            }
        }
    }

}