package com.salud.consultorio.controller;

import com.salud.consultorio.dto.citaMedica.CitaMedicaActualizarDTO;
import com.salud.consultorio.dto.citaMedica.CitaMedicaCrearDTO;
import com.salud.consultorio.dto.citaMedica.CitaMedicaObservacionDTO;
import com.salud.consultorio.dto.citaMedica.CitaMedicaRespuestaDTO;
import com.salud.consultorio.dto.historialCita.HistorialCitaRespuestaDTO;
import com.salud.consultorio.model.payload.MensajeResponse;
import com.salud.consultorio.service.ICitaMedicaServicio;
import com.salud.consultorio.service.IHistorialCitaServicio;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/citas-medicas")
@RequiredArgsConstructor
@Tag(
        name = "Citas médicas",
        description = "Endpoints para la gestión de citas médicas. " +
                "Estados: 0 = eliminada, 1 = programada, 2 = cancelada, 3 = atendida, 4 = reprogramada"
)
public class CitaMedicaController {

    private final ICitaMedicaServicio citaMedicaServicio;
    private final IHistorialCitaServicio historialCitaServicio;

    @Operation(
            summary = "Registrar una nueva cita médica",
            description = "Valida que el paciente, el médico y el usuario existan y estén activos, " +
                    "que la fecha no sea pasada, que la hora de inicio sea anterior a la hora de salida, " +
                    "que el médico tenga horario de atención y que no se cruce con otra cita programada. " +
                    "La cita se crea en estado 1 (programada) y se registra el evento CREADA en el historial."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Cita médica registrada correctamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos, entidad inactiva o médico sin horario disponible"),
            @ApiResponse(responseCode = "404", description = "Paciente, médico o usuario no encontrado"),
            @ApiResponse(responseCode = "409", description = "El médico ya tiene una cita programada que se cruza con ese horario")
    })
    @PostMapping
    public ResponseEntity<MensajeResponse> crearCita(@Valid @RequestBody CitaMedicaCrearDTO citaMedicaCrearDTO) {

        CitaMedicaRespuestaDTO cita = citaMedicaServicio.crear(citaMedicaCrearDTO);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Cita médica registrada con exito")
                .object(cita).build(), HttpStatus.CREATED);

    }

    @Operation(
            summary = "Listar citas médicas por estado",
            description = "Sin el parámetro 'estado' devuelve las citas 1, 2, 3 y 4 (excluye las eliminadas). " +
                    "Con 'estado' filtra por ese valor (0 a 4)."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de citas médicas obtenida correctamente"),
            @ApiResponse(responseCode = "400", description = "Estado inválido")
    })
    @GetMapping
    public ResponseEntity<MensajeResponse> listar(
            @Parameter(description = "0 = eliminada, 1 = programada, 2 = cancelada, 3 = atendida, 4 = reprogramada")
            @RequestParam(required = false, name = "estado") Integer estado) {

        List<CitaMedicaRespuestaDTO> lista = citaMedicaServicio.lista(estado);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("LISTA DE CITAS MEDICAS")
                .object(lista).build(), HttpStatus.OK);

    }

    @Operation(
            summary = "Listar mis citas médicas (médico autenticado)",
            description = "Devuelve únicamente las citas asignadas al médico autenticado. La identidad se obtiene del JWT, " +
                    "se valida el rol MEDICO activo y la relación Usuario → Persona → Empleado → Médico activa. " +
                    "Sin 'estado' devuelve los estados 1 a 4. Si no tiene citas devuelve una lista vacía."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de citas obtenida correctamente (puede ser vacía)"),
            @ApiResponse(responseCode = "400", description = "Estado inválido"),
            @ApiResponse(responseCode = "403", description = "El usuario no es un médico activo con rol MEDICO activo")
    })
    @GetMapping("/mis-citas/medico")
    public ResponseEntity<MensajeResponse> listarMisCitasMedico(
            @Parameter(description = "1 = programada, 2 = cancelada, 3 = atendida, 4 = reprogramada")
            @RequestParam(required = false, name = "estado") Integer estado) {

        List<CitaMedicaRespuestaDTO> lista = citaMedicaServicio.listaMisCitasMedico(estado);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("LISTA DE MIS CITAS MEDICAS")
                .object(lista).build(), HttpStatus.OK);

    }

    @Operation(
            summary = "Listar mis citas reservadas (paciente autenticado)",
            description = "Devuelve únicamente las citas del paciente autenticado. La identidad se obtiene del JWT y se " +
                    "valida la relación Usuario → Persona → Paciente activa. " +
                    "Sin 'estado' devuelve los estados 1 a 4. Si no tiene citas devuelve una lista vacía."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de citas obtenida correctamente (puede ser vacía)"),
            @ApiResponse(responseCode = "400", description = "Estado inválido"),
            @ApiResponse(responseCode = "403", description = "El usuario no es un paciente activo")
    })
    @GetMapping("/mis-citas/paciente")
    public ResponseEntity<MensajeResponse> listarMisCitasPaciente(
            @Parameter(description = "1 = programada, 2 = cancelada, 3 = atendida, 4 = reprogramada")
            @RequestParam(required = false, name = "estado") Integer estado) {

        List<CitaMedicaRespuestaDTO> lista = citaMedicaServicio.listaMisCitasPaciente(estado);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("LISTA DE MIS CITAS RESERVADAS")
                .object(lista).build(), HttpStatus.OK);

    }

    @Operation(summary = "Obtener cita médica por ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Cita médica encontrada"),
            @ApiResponse(responseCode = "404", description = "Cita médica no encontrada")
    })
    @GetMapping("/{id}")
    public ResponseEntity<MensajeResponse> leerCitaPorId(@PathVariable Integer id) {

        CitaMedicaRespuestaDTO cita = citaMedicaServicio.entidadPorID(id);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Informacion de la cita medica solicitada")
                .object(cita).build(), HttpStatus.OK);

    }

    @Operation(
            summary = "Consultar historial de la cita médica",
            description = "Devuelve los eventos de la cita en orden cronológico (solo lectura)."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Historial obtenido correctamente"),
            @ApiResponse(responseCode = "404", description = "Cita médica no encontrada")
    })
    @GetMapping("/{idCita}/historial")
    public ResponseEntity<MensajeResponse> historialCita(@PathVariable Integer idCita) {

        List<HistorialCitaRespuestaDTO> historial = historialCitaServicio.listaPorCita(idCita);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("HISTORIAL DE LA CITA MEDICA")
                .object(historial).build(), HttpStatus.OK);

    }

    @Operation(
            summary = "Actualizar cita médica",
            description = "Solo se pueden editar citas programadas (estado 1). Se vuelven a validar los datos, " +
                    "el horario del médico y los cruces. Si cambia médico, fecha u hora se registra REPROGRAMADA; " +
                    "si cambian otros datos, MODIFICADA; si no hay cambios, no se registra nada."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Cita médica actualizada correctamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos, cita no editable o médico sin horario disponible"),
            @ApiResponse(responseCode = "404", description = "Cita, paciente, médico o usuario no encontrado"),
            @ApiResponse(responseCode = "409", description = "El médico ya tiene una cita programada que se cruza con ese horario")
    })
    @PutMapping("/{id}")
    public ResponseEntity<MensajeResponse> actualizarCita(
            @PathVariable Integer id,
            @Valid @RequestBody CitaMedicaActualizarDTO dto) {

        CitaMedicaRespuestaDTO respuesta = citaMedicaServicio.actualizar(dto, id);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Cita medica actualizada con exito")
                .object(respuesta).build(), HttpStatus.OK);

    }

    @Operation(
            summary = "Cancelar cita médica",
            description = "Cambia el estado a 2 (cancelada) sin eliminar el registro y registra el evento " +
                    "CANCELADA en el historial. Solo citas programadas. La observación (motivo) es opcional."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Cita médica cancelada correctamente"),
            @ApiResponse(responseCode = "400", description = "La cita no está programada u observación inválida"),
            @ApiResponse(responseCode = "404", description = "Cita médica no encontrada")
    })
    @PatchMapping("/{id}/cancelar")
    public ResponseEntity<MensajeResponse> cancelarCita(
            @PathVariable Integer id,
            @Valid @RequestBody(required = false) CitaMedicaObservacionDTO dto) {

        citaMedicaServicio.cancelar(id, dto == null ? null : dto.observacion());

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Cita medica cancelada con exito")
                .build(), HttpStatus.OK);

    }

    @Operation(
            summary = "Registrar atención de la cita médica",
            description = "Cambia el estado a 3 (atendida) y registra el evento ATENDIDA en el historial. " +
                    "Solo se pueden atender citas programadas: no canceladas, eliminadas ni ya atendidas."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Atención registrada correctamente"),
            @ApiResponse(responseCode = "400", description = "La cita no está programada u observación inválida"),
            @ApiResponse(responseCode = "404", description = "Cita médica no encontrada")
    })
    @PatchMapping("/{id}/atender")
    public ResponseEntity<MensajeResponse> atenderCita(
            @PathVariable Integer id,
            @Valid @RequestBody(required = false) CitaMedicaObservacionDTO dto) {

        citaMedicaServicio.atender(id, dto == null ? null : dto.observacion());

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Atencion medica registrada con exito")
                .build(), HttpStatus.OK);

    }

    @Operation(
            summary = "Eliminar cita médica",
            description = "Eliminación lógica: cambia el estado a 0 sin borrar el registro y registra el evento " +
                    "ELIMINADA. No se puede eliminar una cita que ya está eliminada."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Cita médica eliminada correctamente"),
            @ApiResponse(responseCode = "400", description = "La cita médica ya se encuentra eliminada"),
            @ApiResponse(responseCode = "404", description = "Cita médica no encontrada")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<MensajeResponse> eliminarCitaPorId(@PathVariable Integer id) {

        citaMedicaServicio.eliminarPorId(id);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Cita medica eliminada con exito")
                .build(), HttpStatus.OK);

    }

}