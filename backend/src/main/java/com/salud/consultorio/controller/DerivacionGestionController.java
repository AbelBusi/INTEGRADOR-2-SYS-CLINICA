package com.salud.consultorio.controller;

import com.salud.consultorio.dto.citaMedica.CitaMedicaCrearDTO;
import com.salud.consultorio.model.payload.MensajeResponse;
import com.salud.consultorio.service.IDerivacionGestionServicio;
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
@RequestMapping("api/v1/derivaciones")
@RequiredArgsConstructor
@Tag(name = "Derivaciones - programación de cita", description = "Búsqueda por código y programación de la cita derivada")
public class DerivacionGestionController {

    private final IDerivacionGestionServicio derivacionServicio;

    @Operation(summary = "Buscar una derivación por su código (DER-XXXXXX)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Derivación encontrada"),
            @ApiResponse(responseCode = "400", description = "Código inválido"),
            @ApiResponse(responseCode = "404", description = "Derivación no encontrada")
    })
    @GetMapping("/codigo/{codigo}")
    public ResponseEntity<MensajeResponse> buscarPorCodigo(@PathVariable String codigo) {
        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("DERIVACION ENCONTRADA")
                .object(derivacionServicio.buscarPorCodigo(codigo)).build(), HttpStatus.OK);
    }

    @Operation(summary = "Programar la cita de una derivación pendiente",
            description = "Crea la cita con las validaciones del módulo de citas y deja la derivación en PROGRAMADA. " +
                    "El paciente debe ser el de la derivación y el médico debe estar activo y ser de la especialidad derivada.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Cita programada y derivación actualizada"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos, médico fuera de la especialidad o regla de cita incumplida"),
            @ApiResponse(responseCode = "404", description = "Derivación o médico no encontrados"),
            @ApiResponse(responseCode = "409", description = "Derivación no pendiente o conflicto de horario")
    })
    @PostMapping("/{idDerivacion}/programar-cita")
    public ResponseEntity<MensajeResponse> programarCita(
            @PathVariable Integer idDerivacion,
            @Valid @RequestBody CitaMedicaCrearDTO dto) {
        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Cita programada con exito")
                .object(derivacionServicio.programarCita(idDerivacion, dto)).build(), HttpStatus.CREATED);
    }

}