package com.salud.consultorio.controller;

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

}