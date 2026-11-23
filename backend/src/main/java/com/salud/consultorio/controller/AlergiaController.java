package com.salud.consultorio.controller;

import com.salud.consultorio.dto.historiaClinica.AlergiaActualizarDTO;
import com.salud.consultorio.dto.historiaClinica.AlergiaCrearDTO;
import com.salud.consultorio.model.payload.MensajeResponse;
import com.salud.consultorio.service.IAlergiaServicio;
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
@RequestMapping("api/v1/historias-clinicas/{idHistoria}/alergias")
@RequiredArgsConstructor
@Tag(name = "Historias clínicas - Alergias",
        description = "Sustancia, tipo de alergia, reacción presentada y observaciones")
public class AlergiaController {

    private final IAlergiaServicio servicio;

    @Operation(summary = "Registrar una alergia")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Alergia registrada"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos"),
            @ApiResponse(responseCode = "403", description = "Sin relación asistencial con el paciente"),
            @ApiResponse(responseCode = "404", description = "Historia clínica no encontrada")
    })
    @PostMapping
    public ResponseEntity<MensajeResponse> crear(@PathVariable Integer idHistoria,
                                                 @Valid @RequestBody AlergiaCrearDTO dto) {

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Alergia registrada con exito")
                .object(servicio.crear(idHistoria, dto)).build(), HttpStatus.CREATED);

    }

    @Operation(summary = "Actualizar una alergia")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Alergia actualizada"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos"),
            @ApiResponse(responseCode = "403", description = "Sin relación asistencial con el paciente"),
            @ApiResponse(responseCode = "404", description = "Alergia no encontrada")
    })
    @PutMapping("/{id}")
    public ResponseEntity<MensajeResponse> actualizar(@PathVariable Integer idHistoria,
                                                      @PathVariable Integer id,
                                                      @Valid @RequestBody AlergiaActualizarDTO dto) {

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Alergia actualizada con exito")
                .object(servicio.actualizar(idHistoria, id, dto)).build(), HttpStatus.OK);

    }

    @Operation(summary = "Eliminar una alergia",
            description = "Eliminación lógica: el registro se conserva y la operación queda auditada.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Alergia eliminada"),
            @ApiResponse(responseCode = "403", description = "Sin relación asistencial con el paciente"),
            @ApiResponse(responseCode = "404", description = "Alergia no encontrada")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<MensajeResponse> eliminar(@PathVariable Integer idHistoria, @PathVariable Integer id) {

        servicio.eliminar(idHistoria, id);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Alergia eliminada con exito").build(), HttpStatus.OK);

    }

}