package com.salud.consultorio.controller;

import com.salud.consultorio.dto.derivacion.DerivacionActualizarDTO;
import com.salud.consultorio.dto.derivacion.DerivacionCrearDTO;
import com.salud.consultorio.dto.derivacion.DerivacionRespuestaDTO;
import com.salud.consultorio.model.payload.MensajeResponse;
import com.salud.consultorio.service.IDerivacionServicio;
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
@RequestMapping("api/v1/diagnosticos/{idDiagnostico}/derivaciones")
@RequiredArgsConstructor
@Tag(name = "Derivaciones", description = "Derivaciones a otras especialidades asociadas a un diagnóstico")
public class DerivacionController {

    private final IDerivacionServicio derivacionServicio;

    @Operation(
            summary = "Registrar una derivación de un diagnóstico",
            description = "Solo el médico asignado a la cita del diagnóstico. La cita debe estar programada (1) o atendida (3). " +
                    "La especialidad debe existir y estar activa; no se repite la misma especialidad activa dentro " +
                    "del diagnóstico. La urgencia es opcional (por defecto 1)."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Derivación registrada correctamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos o cita en estado que no admite registros"),
            @ApiResponse(responseCode = "403", description = "El diagnóstico no pertenece a una cita del médico autenticado"),
            @ApiResponse(responseCode = "404", description = "Diagnóstico o especialidad no encontrados"),
            @ApiResponse(responseCode = "409", description = "Derivación duplicada a la misma especialidad")
    })
    @PostMapping
    public ResponseEntity<MensajeResponse> crear(
            @PathVariable Integer idDiagnostico,
            @Valid @RequestBody DerivacionCrearDTO dto) {

        DerivacionRespuestaDTO respuesta = derivacionServicio.crear(idDiagnostico, dto);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Derivacion registrada con exito")
                .object(respuesta).build(), HttpStatus.CREATED);

    }

    @Operation(summary = "Listar las derivaciones activas de un diagnóstico")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista obtenida correctamente (puede ser vacía)"),
            @ApiResponse(responseCode = "403", description = "El diagnóstico no pertenece a una cita del médico autenticado"),
            @ApiResponse(responseCode = "404", description = "Diagnóstico no encontrado")
    })
    @GetMapping
    public ResponseEntity<MensajeResponse> listarPorDiagnostico(@PathVariable Integer idDiagnostico) {

        List<DerivacionRespuestaDTO> lista = derivacionServicio.listaPorDiagnostico(idDiagnostico);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("LISTA DE DERIVACIONES DEL DIAGNOSTICO")
                .object(lista).build(), HttpStatus.OK);

    }

    @Operation(
            summary = "Editar una derivación de un diagnóstico",
            description = "Solo el médico asignado, mientras la atención no esté finalizada y la derivación esté pendiente. " +
                    "No se repite una derivación vigente a la misma especialidad."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Derivación actualizada correctamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos o atención finalizada"),
            @ApiResponse(responseCode = "403", description = "El diagnóstico no pertenece a una cita del médico autenticado"),
            @ApiResponse(responseCode = "404", description = "Diagnóstico, derivación o especialidad no encontrados"),
            @ApiResponse(responseCode = "409", description = "Derivación no pendiente o duplicada")
    })
    @PutMapping("/{idDerivacion}")
    public ResponseEntity<MensajeResponse> actualizar(
            @PathVariable Integer idDiagnostico,
            @PathVariable Integer idDerivacion,
            @Valid @RequestBody DerivacionActualizarDTO dto) {

        DerivacionRespuestaDTO respuesta = derivacionServicio.actualizar(idDiagnostico, idDerivacion, dto);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Derivacion actualizada con exito")
                .object(respuesta).build(), HttpStatus.OK);

    }

    @Operation(
            summary = "Eliminar una derivación de un diagnóstico",
            description = "Eliminación lógica. Solo el médico asignado, mientras la atención no esté finalizada y la derivación esté pendiente."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Derivación eliminada correctamente"),
            @ApiResponse(responseCode = "400", description = "Atención finalizada"),
            @ApiResponse(responseCode = "403", description = "El diagnóstico no pertenece a una cita del médico autenticado"),
            @ApiResponse(responseCode = "404", description = "Diagnóstico o derivación no encontrados"),
            @ApiResponse(responseCode = "409", description = "Derivación no pendiente")
    })
    @DeleteMapping("/{idDerivacion}")
    public ResponseEntity<MensajeResponse> eliminar(
            @PathVariable Integer idDiagnostico,
            @PathVariable Integer idDerivacion) {

        derivacionServicio.eliminar(idDiagnostico, idDerivacion);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Derivacion eliminada con exito")
                .build(), HttpStatus.OK);

    }

}