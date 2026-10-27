package com.salud.consultorio.controller;

import com.salud.consultorio.dto.indicacion.IndicacionCrearDTO;
import com.salud.consultorio.dto.indicacion.IndicacionRespuestaDTO;
import com.salud.consultorio.model.payload.MensajeResponse;
import com.salud.consultorio.service.IIndicacionServicio;
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
@RequestMapping("api/v1/diagnosticos/{idDiagnostico}/indicaciones")
@RequiredArgsConstructor
@Tag(name = "Indicaciones", description = "Indicaciones asociadas a un diagnóstico de una cita médica")
public class IndicacionController {

    private final IIndicacionServicio indicacionServicio;

    @Operation(
            summary = "Registrar una indicación de un diagnóstico",
            description = "Solo el médico asignado a la cita del diagnóstico. La cita debe estar programada (1) o atendida (3)."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Indicación registrada correctamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos o cita en estado que no admite registros"),
            @ApiResponse(responseCode = "403", description = "El diagnóstico no pertenece a una cita del médico autenticado"),
            @ApiResponse(responseCode = "404", description = "Diagnóstico no encontrado")
    })
    @PostMapping
    public ResponseEntity<MensajeResponse> crear(
            @PathVariable Integer idDiagnostico,
            @Valid @RequestBody IndicacionCrearDTO dto) {

        IndicacionRespuestaDTO respuesta = indicacionServicio.crear(idDiagnostico, dto);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Indicacion registrada con exito")
                .object(respuesta).build(), HttpStatus.CREATED);

    }

    @Operation(summary = "Listar las indicaciones activas de un diagnóstico")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista obtenida correctamente (puede ser vacía)"),
            @ApiResponse(responseCode = "403", description = "El diagnóstico no pertenece a una cita del médico autenticado"),
            @ApiResponse(responseCode = "404", description = "Diagnóstico no encontrado")
    })
    @GetMapping
    public ResponseEntity<MensajeResponse> listarPorDiagnostico(@PathVariable Integer idDiagnostico) {

        List<IndicacionRespuestaDTO> lista = indicacionServicio.listaPorDiagnostico(idDiagnostico);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("LISTA DE INDICACIONES DEL DIAGNOSTICO")
                .object(lista).build(), HttpStatus.OK);

    }

}