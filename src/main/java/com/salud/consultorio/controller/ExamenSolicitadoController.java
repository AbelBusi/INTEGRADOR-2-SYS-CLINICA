package com.salud.consultorio.controller;

import com.salud.consultorio.dto.examenSolicitado.ExamenSolicitadoCrearDTO;
import com.salud.consultorio.dto.examenSolicitado.ExamenSolicitadoRespuestaDTO;
import com.salud.consultorio.model.payload.MensajeResponse;
import com.salud.consultorio.service.IExamenSolicitadoServicio;
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
@RequestMapping("api/v1/diagnosticos/{idDiagnostico}/examenes-solicitados")
@RequiredArgsConstructor
@Tag(name = "Exámenes solicitados", description = "Exámenes solicitados asociados a un diagnóstico de una cita médica")
public class ExamenSolicitadoController {

    private final IExamenSolicitadoServicio examenSolicitadoServicio;

    @Operation(
            summary = "Registrar un examen solicitado de un diagnóstico",
            description = "Solo el médico asignado a la cita del diagnóstico. La cita debe estar programada (1) o atendida (3)."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Examen solicitado registrado correctamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos o cita en estado que no admite registros"),
            @ApiResponse(responseCode = "403", description = "El diagnóstico no pertenece a una cita del médico autenticado"),
            @ApiResponse(responseCode = "404", description = "Diagnóstico no encontrado")
    })
    @PostMapping
    public ResponseEntity<MensajeResponse> crear(
            @PathVariable Integer idDiagnostico,
            @Valid @RequestBody ExamenSolicitadoCrearDTO dto) {

        ExamenSolicitadoRespuestaDTO respuesta = examenSolicitadoServicio.crear(idDiagnostico, dto);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Examen solicitado registrado con exito")
                .object(respuesta).build(), HttpStatus.CREATED);

    }

    @Operation(summary = "Listar los exámenes solicitados activos de un diagnóstico")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista obtenida correctamente (puede ser vacía)"),
            @ApiResponse(responseCode = "403", description = "El diagnóstico no pertenece a una cita del médico autenticado"),
            @ApiResponse(responseCode = "404", description = "Diagnóstico no encontrado")
    })
    @GetMapping
    public ResponseEntity<MensajeResponse> listarPorDiagnostico(@PathVariable Integer idDiagnostico) {

        List<ExamenSolicitadoRespuestaDTO> lista = examenSolicitadoServicio.listaPorDiagnostico(idDiagnostico);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("LISTA DE EXAMENES SOLICITADOS DEL DIAGNOSTICO")
                .object(lista).build(), HttpStatus.OK);

    }

}