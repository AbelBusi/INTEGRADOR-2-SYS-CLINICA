package com.salud.consultorio.controller;

import com.salud.consultorio.dto.historiaClinica.AntecedentePersonalActualizarDTO;
import com.salud.consultorio.dto.historiaClinica.AntecedentePersonalCrearDTO;
import com.salud.consultorio.model.payload.MensajeResponse;
import com.salud.consultorio.service.IAntecedentePersonalServicio;
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
@RequestMapping("api/v1/historias-clinicas/{idHistoria}/antecedentes-personales")
@RequiredArgsConstructor
@Tag(name = "Historias clínicas - Antecedentes personales",
        description = "Enfermedades previas y crónicas, antecedentes quirúrgicos, hospitalizaciones y otros")
public class AntecedentePersonalController {

    private final IAntecedentePersonalServicio servicio;

    @Operation(summary = "Registrar un antecedente personal")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Antecedente registrado"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos"),
            @ApiResponse(responseCode = "403", description = "Sin relación asistencial con el paciente"),
            @ApiResponse(responseCode = "404", description = "Historia clínica no encontrada")
    })
    @PostMapping
    public ResponseEntity<MensajeResponse> crear(@PathVariable Integer idHistoria,
                                                 @Valid @RequestBody AntecedentePersonalCrearDTO dto) {

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Antecedente personal registrado con exito")
                .object(servicio.crear(idHistoria, dto)).build(), HttpStatus.CREATED);

    }

    @Operation(summary = "Actualizar un antecedente personal")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Antecedente actualizado"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos"),
            @ApiResponse(responseCode = "403", description = "Sin relación asistencial con el paciente"),
            @ApiResponse(responseCode = "404", description = "Antecedente no encontrado")
    })
    @PutMapping("/{id}")
    public ResponseEntity<MensajeResponse> actualizar(@PathVariable Integer idHistoria,
                                                      @PathVariable Integer id,
                                                      @Valid @RequestBody AntecedentePersonalActualizarDTO dto) {

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Antecedente personal actualizado con exito")
                .object(servicio.actualizar(idHistoria, id, dto)).build(), HttpStatus.OK);

    }

    @Operation(summary = "Eliminar un antecedente personal",
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
                .mensaje("Antecedente personal eliminado con exito").build(), HttpStatus.OK);

    }

}