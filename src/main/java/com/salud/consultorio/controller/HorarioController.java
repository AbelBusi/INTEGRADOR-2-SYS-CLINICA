package com.salud.consultorio.controller;

import com.salud.consultorio.dto.horario.AgendaDTO;
import com.salud.consultorio.dto.horario.DisponibilidadDTO;
import com.salud.consultorio.dto.horario.HorarioTrabajoActualizarDTO;
import com.salud.consultorio.dto.horario.HorarioTrabajoCrearDTO;
import com.salud.consultorio.dto.horario.HorarioTrabajoLeerDTO;
import com.salud.consultorio.model.payload.MensajeResponse;
import com.salud.consultorio.service.IHorarioTrabajoServicio;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("api/v1/horarios")
@RequiredArgsConstructor
@Tag(
        name = "Horarios",
        description = "Endpoints para la gestión de horarios de trabajo y disponibilidad"
)
public class HorarioController {

    private final IHorarioTrabajoServicio horarioServicio;

    @Operation(summary = "Registrar un horario de trabajo")
    @PostMapping
    public ResponseEntity<MensajeResponse> crear(@Valid @RequestBody HorarioTrabajoCrearDTO dto) {
        HorarioTrabajoLeerDTO horario = horarioServicio.crear(dto);
        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Horario registrado con exito")
                .object(horario).build(), HttpStatus.CREATED);
    }

    @Operation(summary = "Listar horarios de trabajo")
    @GetMapping
    public ResponseEntity<MensajeResponse> listar() {
        List<HorarioTrabajoLeerDTO> horarios = horarioServicio.listar();
        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("LISTA DE HORARIOS")
                .object(horarios).build(), HttpStatus.OK);
    }

    @Operation(summary = "Obtener un horario por ID")
    @GetMapping("/{id}")
    public ResponseEntity<MensajeResponse> obtenerPorId(@PathVariable Integer id) {
        HorarioTrabajoLeerDTO horario = horarioServicio.obtenerPorId(id);
        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Informacion del horario solicitado")
                .object(horario).build(), HttpStatus.OK);
    }

    @Operation(summary = "Actualizar un horario de trabajo")
    @PutMapping("/{id}")
    public ResponseEntity<MensajeResponse> actualizar(@PathVariable Integer id, @Valid @RequestBody HorarioTrabajoActualizarDTO dto) {
        HorarioTrabajoLeerDTO horario = horarioServicio.actualizar(dto, id);
        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("EL HORARIO FUE ACTUALIZADO CON EXITO")
                .object(horario).build(), HttpStatus.OK);
    }

    @Operation(summary = "Eliminar un horario de trabajo")
    @DeleteMapping("/{id}")
    public ResponseEntity<MensajeResponse> eliminar(@PathVariable Integer id) {
        horarioServicio.eliminarPorId(id);
        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Horario eliminado con exito")
                .object(null).build(), HttpStatus.NO_CONTENT);
    }

    @Operation(summary = "Doctores disponibles en una fecha y rango horario")
    @GetMapping("/disponibilidad/doctores")
    public ResponseEntity<MensajeResponse> doctoresDisponibles(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime horaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime horaFin,
            @RequestParam(required = false) Integer especialidadId) {

        List<DisponibilidadDTO> doctores = horarioServicio.doctoresDisponibles(fecha, horaInicio, horaFin, especialidadId);
        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("DOCTORES DISPONIBLES")
                .object(doctores).build(), HttpStatus.OK);
    }

    @Operation(summary = "Agenda (bloques laborales y citas) de un doctor o recepcionista en un rango de fechas")
    @GetMapping("/agenda")
    public ResponseEntity<MensajeResponse> agenda(
            @RequestParam String tipo,
            @RequestParam Integer referenciaId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate desde,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate hasta) {

        AgendaDTO agenda = horarioServicio.agenda(tipo, referenciaId, desde, hasta);
        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("AGENDA DEL TRABAJADOR")
                .object(agenda).build(), HttpStatus.OK);
    }

    @Operation(summary = "Recepcionistas disponibles en una fecha y rango horario")
    @GetMapping("/disponibilidad/recepcionistas")
    public ResponseEntity<MensajeResponse> recepcionistasDisponibles(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime horaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime horaFin) {

        List<DisponibilidadDTO> recepcionistas = horarioServicio.recepcionistasDisponibles(fecha, horaInicio, horaFin);
        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("RECEPCIONISTAS DISPONIBLES")
                .object(recepcionistas).build(), HttpStatus.OK);
    }

}
