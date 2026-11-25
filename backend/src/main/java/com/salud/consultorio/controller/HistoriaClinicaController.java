package com.salud.consultorio.controller;

import com.salud.consultorio.dto.historiaClinica.*;
import com.salud.consultorio.model.payload.MensajeResponse;
import com.salud.consultorio.service.IAtencionHistoriaServicio;
import com.salud.consultorio.service.IAuditoriaHistoriaClinicaServicio;
import com.salud.consultorio.service.IHistoriaClinicaServicio;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/historias-clinicas")
@RequiredArgsConstructor
@Tag(name = "Historias clínicas",
        description = "Información médica general y permanente del paciente. Las atenciones se obtienen de Citas Médicas (solo lectura).")
public class HistoriaClinicaController {

    private final IHistoriaClinicaServicio historiaClinicaServicio;
    private final IAtencionHistoriaServicio atencionHistoriaServicio;
    private final IAuditoriaHistoriaClinicaServicio auditoriaServicio;

    @Operation(summary = "Consultar la historia clínica de un paciente",
            description = "Solo médicos con relación asistencial (cita programada o atendida) con el paciente.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Historia clínica encontrada"),
            @ApiResponse(responseCode = "403", description = "Sin relación asistencial con el paciente"),
            @ApiResponse(responseCode = "404", description = "El paciente aún no tiene historia clínica")
    })
    @GetMapping("/paciente/{idPaciente}")
    public ResponseEntity<MensajeResponse> obtenerPorPaciente(@PathVariable Integer idPaciente) {

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Historia clinica del paciente")
                .object(historiaClinicaServicio.obtenerPorPaciente(idPaciente)).build(), HttpStatus.OK);

    }

    @Operation(summary = "Consultar mi historia clínica",
            description = "El paciente autenticado consulta únicamente la suya. La identidad se obtiene del JWT.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Historia clínica encontrada"),
            @ApiResponse(responseCode = "403", description = "El usuario no es un paciente activo"),
            @ApiResponse(responseCode = "404", description = "Aún no tiene historia clínica")
    })
    @GetMapping("/mi-historia")
    public ResponseEntity<MensajeResponse> obtenerMiHistoria() {

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Mi historia clinica")
                .object(historiaClinicaServicio.obtenerMiHistoria()).build(), HttpStatus.OK);

    }

    @Operation(summary = "Crear la historia clínica de un paciente",
            description = "Una sola por paciente. Solo médicos con relación asistencial. El número de historia se genera automáticamente.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Historia clínica creada"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos o paciente inactivo"),
            @ApiResponse(responseCode = "403", description = "Sin relación asistencial con el paciente"),
            @ApiResponse(responseCode = "409", description = "El paciente ya tiene historia clínica")
    })
    @PostMapping
    public ResponseEntity<MensajeResponse> crear(@Valid @RequestBody HistoriaClinicaCrearDTO dto) {

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Historia clinica creada con exito")
                .object(historiaClinicaServicio.crear(dto)).build(), HttpStatus.CREATED);

    }

    @Operation(summary = "Actualizar la información general",
            description = "Grupo sanguíneo, factor Rh y observaciones. Los campos nulos no se modifican; observaciones vacías limpian el campo. Cada cambio queda auditado.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Historia clínica actualizada"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos o historia inactiva"),
            @ApiResponse(responseCode = "403", description = "Sin relación asistencial con el paciente"),
            @ApiResponse(responseCode = "404", description = "Historia clínica no encontrada")
    })
    @PutMapping("/{idHistoria}")
    public ResponseEntity<MensajeResponse> actualizar(@PathVariable Integer idHistoria,
                                                      @Valid @RequestBody HistoriaClinicaActualizarDTO dto) {

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Historia clinica actualizada con exito")
                .object(historiaClinicaServicio.actualizar(idHistoria, dto)).build(), HttpStatus.OK);

    }

    @Operation(summary = "Atenciones médicas de un paciente (solo lectura)",
            description = "Citas atendidas con sus diagnósticos, tratamientos, indicaciones y derivaciones, de la más reciente a la más antigua.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Atenciones obtenidas (puede ser vacía)"),
            @ApiResponse(responseCode = "403", description = "Sin relación asistencial con el paciente")
    })
    @GetMapping("/paciente/{idPaciente}/atenciones")
    public ResponseEntity<MensajeResponse> atencionesPorPaciente(
            @PathVariable Integer idPaciente,
            @RequestParam(defaultValue = "0") int pagina,
            @RequestParam(defaultValue = "10") int tamanio) {

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Atenciones medicas del paciente")
                .object(atencionHistoriaServicio.listarPorPaciente(idPaciente, pagina, tamanio)).build(), HttpStatus.OK);

    }

    @Operation(summary = "Mis atenciones médicas (solo lectura)",
            description = "El paciente autenticado consulta sus propias atenciones.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Atenciones obtenidas (puede ser vacía)"),
            @ApiResponse(responseCode = "403", description = "El usuario no es un paciente activo")
    })
    @GetMapping("/mi-historia/atenciones")
    public ResponseEntity<MensajeResponse> misAtenciones(
            @RequestParam(defaultValue = "0") int pagina,
            @RequestParam(defaultValue = "10") int tamanio) {

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Mis atenciones medicas")
                .object(atencionHistoriaServicio.listarMias(pagina, tamanio)).build(), HttpStatus.OK);

    }

    @Operation(summary = "Listar historias clínicas",
            description = "Solo las historias de pacientes con los que el médico autenticado tiene relación asistencial (cita programada o atendida).")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Historias obtenidas (puede ser vacía)"),
            @ApiResponse(responseCode = "403", description = "Sin autorización para consultar historias")
    })
    @GetMapping
    public ResponseEntity<MensajeResponse> listar() {

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Historias clinicas")
                .object(historiaClinicaServicio.listar()).build(), HttpStatus.OK);

    }

    @Operation(summary = "Mi auditoría",
            description = "El paciente autenticado consulta el registro de cambios de su propia historia clínica.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Registro de cambios obtenido (puede ser vacío)"),
            @ApiResponse(responseCode = "403", description = "El usuario no es un paciente activo"),
            @ApiResponse(responseCode = "404", description = "Aún no tiene historia clínica")
    })
    @GetMapping("/mi-historia/auditoria")
    public ResponseEntity<MensajeResponse> miAuditoria(
            @RequestParam(defaultValue = "0") int pagina,
            @RequestParam(defaultValue = "15") int tamanio) {

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Mi auditoria de historia clinica")
                .object(auditoriaServicio.listarMias(pagina, tamanio)).build(), HttpStatus.OK);

    }

    @Operation(summary = "Auditoría de una historia clínica",
            description = "Registro de cambios (quién, cuándo, qué y valores anterior y nuevo). Solo médicos.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Registro de cambios obtenido (puede ser vacío)"),
            @ApiResponse(responseCode = "403", description = "El usuario no es un médico activo"),
            @ApiResponse(responseCode = "404", description = "Historia clínica no encontrada")
    })
    @GetMapping("/{idHistoria}/auditoria")
    public ResponseEntity<MensajeResponse> auditoria(
            @PathVariable Integer idHistoria,
            @RequestParam(defaultValue = "0") int pagina,
            @RequestParam(defaultValue = "15") int tamanio) {

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Auditoria de historia clinica")
                .object(auditoriaServicio.listarPorHistoria(idHistoria, pagina, tamanio)).build(), HttpStatus.OK);

    }

}