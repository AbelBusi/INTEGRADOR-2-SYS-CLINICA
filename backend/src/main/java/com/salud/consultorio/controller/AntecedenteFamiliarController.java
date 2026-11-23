package com.salud.consultorio.controller;

import com.salud.consultorio.dto.historiaClinica.AntecedenteFamiliarActualizarDTO;
import com.salud.consultorio.dto.historiaClinica.AntecedenteFamiliarCrearDTO;
import com.salud.consultorio.model.payload.MensajeResponse;
import com.salud.consultorio.service.IAntecedenteFamiliarServicio;
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
@RequestMapping("api/v1/historias-clinicas/{idHistoria}/antecedentes-familiares")
@RequiredArgsConstructor
@Tag(name = "Historias clínicas - Antecedentes familiares",
        description = "Enfermedades hereditarias y antecedentes familiares relevantes")
public class AntecedenteFamiliarController {

    private final IAntecedenteFamiliarServicio servicio;

    @Operation(summary = "Registrar un antecedente familiar")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Antecedente registrado"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos"),
            @ApiResponse(responseCode = "403", description = "Sin relación asistencial con el paciente"),
            @ApiResponse(responseCode = "404", description = "Historia clínica no encontrada")
    })
    @PostMapping
    public ResponseEntity<MensajeResponse> crear(@PathVariable Integer idHistoria,
                                                 @Valid @RequestBody AntecedenteFamiliarCrearDTO dto) {

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Antecedente familiar registrado con exito")
                .object(servicio.crear(idHistoria, dto)).build(), HttpStatus.CREATED);

    }

    @Operation(summary = "Actualizar un antecedente familiar")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Antecedente actualizado"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos"),
            @ApiResponse(responseCode = "403", description = "Sin relación asistencial con el paciente"),
            @ApiResponse(responseCode = "404", description = "Antecedente no encontrado")
    })
    @PutMapping("/{id}")
    public ResponseEntity<MensajeResponse> actualizar(@PathVariable Integer idHistoria,
                                                      @PathVariable Integer id,
                                                      @Valid @RequestBody AntecedenteFamiliarActualizarDTO dto) {

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Antecedente familiar actualizado con exito")
                .object(servicio.actualizar(idHistoria, id, dto)).build(), HttpStatus.OK);

    }

    @Operation(summary = "Eliminar un antecedente familiar",
            description = "Eliminación lógica: el registro se conserva y la operación queda auditada.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Antecedente eliminado"),
            @ApiResponse(responseCode = "403", description = "Sin relación asistencial con el paciente"),
            @ApiResponse(responseCode = "404", description = "Antecedente no encontrado")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<MensajeResponse> eliminar(@PathVariable Integer idHistoria, @PathVariable Integer id) {

        servicio.eliminar(idHistoria, id);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Antecedente familiar eliminado con exito").build(), HttpStatus.OK);

    }

}