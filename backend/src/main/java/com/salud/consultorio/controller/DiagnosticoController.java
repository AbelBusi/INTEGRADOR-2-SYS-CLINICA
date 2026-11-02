package com.salud.consultorio.controller;

import com.salud.consultorio.dto.diagnostico.DiagnosticoCrearDTO;
import com.salud.consultorio.dto.diagnostico.DiagnosticoRespuestaDTO;
import com.salud.consultorio.model.payload.MensajeResponse;
import com.salud.consultorio.service.IDiagnosticoServicio;
import io.swagger.v3.oas.annotations.Operation;
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
@RequestMapping("api/v1")
@RequiredArgsConstructor
@Tag(name = "Diagnósticos", description = "Diagnósticos registrados por el médico durante la atención de una cita")
public class DiagnosticoController {

    private final IDiagnosticoServicio diagnosticoServicio;

    @Operation(
            summary = "Registrar un diagnóstico en una cita médica",
            description = "Solo el médico asignado a la cita. La cita debe estar programada (1) o atendida (3). " +
                    "No se permite repetir el código de diagnóstico activo dentro de la misma cita. " +
                    "La fecha del diagnóstico la asigna el servidor."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Diagnóstico registrado correctamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos o cita en estado que no admite registros"),
            @ApiResponse(responseCode = "403", description = "La cita no pertenece al médico autenticado"),
            @ApiResponse(responseCode = "404", description = "Cita médica no encontrada"),
            @ApiResponse(responseCode = "409", description = "Diagnóstico duplicado en la cita")
    })
    @PostMapping("/citas-medicas/{idCita}/diagnosticos")
    public ResponseEntity<MensajeResponse> crear(
            @PathVariable Integer idCita,
            @Valid @RequestBody DiagnosticoCrearDTO dto) {

        DiagnosticoRespuestaDTO respuesta = diagnosticoServicio.crear(idCita, dto);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Diagnostico registrado con exito")
                .object(respuesta).build(), HttpStatus.CREATED);

    }

    @Operation(summary = "Listar los diagnósticos activos de una cita médica")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista obtenida correctamente (puede ser vacía)"),
            @ApiResponse(responseCode = "403", description = "La cita no pertenece al médico autenticado"),
            @ApiResponse(responseCode = "404", description = "Cita médica no encontrada")
    })
    @GetMapping("/citas-medicas/{idCita}/diagnosticos")
    public ResponseEntity<MensajeResponse> listarPorCita(@PathVariable Integer idCita) {

        List<DiagnosticoRespuestaDTO> lista = diagnosticoServicio.listaPorCita(idCita);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("LISTA DE DIAGNOSTICOS DE LA CITA")
                .object(lista).build(), HttpStatus.OK);

    }

    @Operation(summary = "Obtener un diagnóstico por ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Diagnóstico encontrado"),
            @ApiResponse(responseCode = "403", description = "El diagnóstico no pertenece a una cita del médico autenticado"),
            @ApiResponse(responseCode = "404", description = "Diagnóstico no encontrado")
    })
    @GetMapping("/diagnosticos/{id}")
    public ResponseEntity<MensajeResponse> leerPorId(@PathVariable Integer id) {

        DiagnosticoRespuestaDTO respuesta = diagnosticoServicio.entidadPorID(id);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Informacion del diagnostico solicitado")
                .object(respuesta).build(), HttpStatus.OK);

    }

}