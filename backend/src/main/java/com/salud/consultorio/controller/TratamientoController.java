package com.salud.consultorio.controller;

import com.salud.consultorio.dto.tratamiento.TratamientoActualizarDTO;
import com.salud.consultorio.dto.tratamiento.TratamientoCrearDTO;
import com.salud.consultorio.dto.tratamiento.TratamientoRespuestaDTO;
import com.salud.consultorio.model.payload.MensajeResponse;
import com.salud.consultorio.service.ITratamientoServicio;
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
@RequestMapping("api/v1/diagnosticos/{idDiagnostico}/tratamientos")
@RequiredArgsConstructor
@Tag(name = "Tratamientos", description = "Tratamientos asociados a un diagnóstico de una cita médica")
public class TratamientoController {

    private final ITratamientoServicio tratamientoServicio;

    @Operation(
            summary = "Registrar un tratamiento de un diagnóstico",
            description = "Solo el médico asignado a la cita del diagnóstico. La cita debe estar programada (1) o atendida (3). " +
                    "No se repite el mismo medicamento activo dentro del diagnóstico."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Tratamiento registrado correctamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos o cita en estado que no admite registros"),
            @ApiResponse(responseCode = "403", description = "El diagnóstico no pertenece a una cita del médico autenticado"),
            @ApiResponse(responseCode = "404", description = "Diagnóstico no encontrado"),
            @ApiResponse(responseCode = "409", description = "Tratamiento duplicado")
    })
    @PostMapping
    public ResponseEntity<MensajeResponse> crear(
            @PathVariable Integer idDiagnostico,
            @Valid @RequestBody TratamientoCrearDTO dto) {

        TratamientoRespuestaDTO respuesta = tratamientoServicio.crear(idDiagnostico, dto);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Tratamiento registrado con exito")
                .object(respuesta).build(), HttpStatus.CREATED);

    }

    @Operation(summary = "Listar los tratamientos activos de un diagnóstico")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista obtenida correctamente (puede ser vacía)"),
            @ApiResponse(responseCode = "403", description = "El diagnóstico no pertenece a una cita del médico autenticado"),
            @ApiResponse(responseCode = "404", description = "Diagnóstico no encontrado")
    })
    @GetMapping
    public ResponseEntity<MensajeResponse> listarPorDiagnostico(@PathVariable Integer idDiagnostico) {

        List<TratamientoRespuestaDTO> lista = tratamientoServicio.listaPorDiagnostico(idDiagnostico);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("LISTA DE TRATAMIENTOS DEL DIAGNOSTICO")
                .object(lista).build(), HttpStatus.OK);

    }

    @Operation(
            summary = "Editar un tratamiento de un diagnóstico",
            description = "Solo el médico asignado y mientras la atención no esté finalizada. " +
                    "No se repite el mismo medicamento activo dentro del diagnóstico."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Tratamiento actualizado correctamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos o atención finalizada"),
            @ApiResponse(responseCode = "403", description = "El diagnóstico no pertenece a una cita del médico autenticado"),
            @ApiResponse(responseCode = "404", description = "Diagnóstico o tratamiento no encontrados"),
            @ApiResponse(responseCode = "409", description = "Tratamiento duplicado")
    })
    @PutMapping("/{idTratamiento}")
    public ResponseEntity<MensajeResponse> actualizar(
            @PathVariable Integer idDiagnostico,
            @PathVariable Integer idTratamiento,
            @Valid @RequestBody TratamientoActualizarDTO dto) {

        TratamientoRespuestaDTO respuesta = tratamientoServicio.actualizar(idDiagnostico, idTratamiento, dto);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Tratamiento actualizado con exito")
                .object(respuesta).build(), HttpStatus.OK);

    }

    @Operation(
            summary = "Eliminar un tratamiento de un diagnóstico",
            description = "Eliminación lógica. Solo el médico asignado y mientras la atención no esté finalizada."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Tratamiento eliminado correctamente"),
            @ApiResponse(responseCode = "400", description = "Atención finalizada"),
            @ApiResponse(responseCode = "403", description = "El diagnóstico no pertenece a una cita del médico autenticado"),
            @ApiResponse(responseCode = "404", description = "Diagnóstico o tratamiento no encontrados")
    })
    @DeleteMapping("/{idTratamiento}")
    public ResponseEntity<MensajeResponse> eliminar(
            @PathVariable Integer idDiagnostico,
            @PathVariable Integer idTratamiento) {

        tratamientoServicio.eliminar(idDiagnostico, idTratamiento);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Tratamiento eliminado con exito")
                .build(), HttpStatus.OK);

    }

}