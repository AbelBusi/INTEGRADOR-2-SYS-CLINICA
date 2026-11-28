package com.salud.consultorio.controller;

import com.salud.consultorio.dto.medicamento.MedicamentoActualizarDTO;
import com.salud.consultorio.dto.medicamento.MedicamentoCrearDTO;
import com.salud.consultorio.model.enums.EntidadEstado;
import com.salud.consultorio.model.payload.MensajeResponse;
import com.salud.consultorio.service.IMedicamentoServicio;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("api/v1/medicamentos")
@RequiredArgsConstructor
@Tag(name = "Medicamentos",
        description = "Catálogo único de medicamentos. Evita que cada módulo escriba el nombre a mano.")
public class MedicamentoController {

    private final IMedicamentoServicio medicamentoServicio;

    @Operation(summary = "Listar medicamentos",
            description = "Sin filtro devuelve activos e inactivos. Filtro: activo | inactivo | todos.")
    @GetMapping
    public ResponseEntity<MensajeResponse> lista(@RequestParam(required = false) String estado) {

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Lista de medicamentos")
                .object(medicamentoServicio.lista(parsearFiltro(estado))).build(), HttpStatus.OK);
    }

    @Operation(summary = "Medicamentos con nombre parecido",
            description = "Para avisar al escribir un nombre que podría estar duplicado o mal escrito.")
    @GetMapping("/similares")
    public ResponseEntity<MensajeResponse> similares(@RequestParam String nombre,
                                                     @RequestParam(required = false) Integer idExcluir) {

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Medicamentos con nombre parecido")
                .object(medicamentoServicio.similares(nombre, idExcluir)).build(), HttpStatus.OK);
    }

    @Operation(summary = "Detalle de un medicamento")
    @GetMapping("/{id}")
    public ResponseEntity<MensajeResponse> detalle(@PathVariable Integer id) {

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Detalle del medicamento")
                .object(medicamentoServicio.entidadPorID(id)).build(), HttpStatus.OK);
    }

    @Operation(summary = "Crear un medicamento",
            description = "multipart/form-data: parte JSON 'medicamento' e imagen opcional 'imagen' (JPG, PNG o WEBP, máx. 2 MB).")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<MensajeResponse> crear(
            @RequestPart("medicamento") @Valid MedicamentoCrearDTO dto,
            @RequestPart(value = "imagen", required = false) MultipartFile imagen) {

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Medicamento creado con éxito")
                .object(medicamentoServicio.crear(dto, imagen)).build(), HttpStatus.CREATED);
    }

    @Operation(summary = "Actualizar un medicamento",
            description = "multipart/form-data: parte JSON 'medicamento' e imagen opcional 'imagen'. Para quitar la imagen enviar quitarImagen=true.")
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<MensajeResponse> actualizar(
            @PathVariable Integer id,
            @RequestPart("medicamento") @Valid MedicamentoActualizarDTO dto,
            @RequestPart(value = "imagen", required = false) MultipartFile imagen) {

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Medicamento actualizado con éxito")
                .object(medicamentoServicio.actualizar(dto, id, imagen)).build(), HttpStatus.OK);
    }

    @Operation(summary = "Activar o desactivar un medicamento")
    @PatchMapping("/{id}/estado")
    public ResponseEntity<MensajeResponse> cambiarEstado(@PathVariable Integer id,
                                                         @RequestParam EntidadEstado estado) {

        medicamentoServicio.cambiarEstado(id, estado);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje(estado == EntidadEstado.ACTIVO
                        ? "Medicamento activado con éxito"
                        : "Medicamento desactivado con éxito")
                .build(), HttpStatus.OK);
    }

    @Operation(summary = "Eliminar un medicamento", description = "Eliminación lógica.")
    @DeleteMapping("/{id}")
    public ResponseEntity<MensajeResponse> eliminar(@PathVariable Integer id) {

        medicamentoServicio.eliminarPorId(id);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Medicamento eliminado con éxito")
                .build(), HttpStatus.OK);
    }

    /** Acepta activo/inactivo/todos sin importar mayúsculas (el front envía minúsculas). */
    private EntidadEstado parsearFiltro(String estado) {

        if (estado == null || estado.isBlank() || "todos".equalsIgnoreCase(estado.trim())) {
            return null;
        }

        try {
            return EntidadEstado.valueOf(estado.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("El filtro de estado debe ser activo, inactivo o todos.");
        }
    }
}