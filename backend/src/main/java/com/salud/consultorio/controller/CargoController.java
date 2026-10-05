package com.salud.consultorio.controller;

import com.salud.consultorio.dto.cargo.*;
import com.salud.consultorio.dto.tipoDocumento.TipoDocumentoResumenDTO;
import com.salud.consultorio.model.enums.EntidadEstado;
import com.salud.consultorio.model.payload.MensajeResponse;
import com.salud.consultorio.service.ICargoServicio;
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
@RequiredArgsConstructor
@RequestMapping("api/v1/cargos")
@Tag(
        name = "Cargos",
        description = "Endpoints para la gestión de cargos"
)
public class CargoController {

    private final ICargoServicio cargoServicio;

    @Operation(summary = "Registrar un nuevo cargo")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Cargo registrado correctamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos")
    })
    @PostMapping
    public ResponseEntity<MensajeResponse> crear(@Valid @RequestBody CargoCrearDTO dto) {

        CargoRespuestaDTO entidad = cargoServicio.crear(dto);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Cargo agregado con exito")
                .object(entidad).build(), HttpStatus.CREATED);

    }

    @Operation(summary = "Listar cargos")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de cargos obtenida correctamente"),
            @ApiResponse(responseCode = "204", description = "No existen pacientes")
    })
    @GetMapping
    public ResponseEntity<MensajeResponse> listar(
            @RequestParam(name = "estado", required = false) EntidadEstado estado) {

        List<CargoRespuestaDTO> listaEntidades = cargoServicio.lista(estado);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje(estado == null ? "LISTA DE CARGOS" : "LISTA DE CARGOS POR ESTADO: " + estado)
                .object(listaEntidades).build(), HttpStatus.OK);

    }

    @Operation(summary = "Eliminar cargo", description = "Eliminación lógica (estado = 0)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Cargo eliminado correctamente"),
            @ApiResponse(responseCode = "400", description = "El cargo ya se encuentra eliminado"),
            @ApiResponse(responseCode = "404", description = "Cargo no encontrado")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<MensajeResponse> eliminar(@PathVariable Integer id) {

        cargoServicio.eliminarPorId(id);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Cargo eliminado con exito")
                .build(), HttpStatus.OK);

    }

    @Operation(summary = "Actualizar cargo")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Cargo actualizado correctamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos"),
            @ApiResponse(responseCode = "404", description = "Cargo no encontrado")
    })
    @PutMapping("/{id}")
    public ResponseEntity<MensajeResponse> actualizar(
            @PathVariable Integer id,
            @Valid @RequestBody CargoActualizarDTO dto) {

        CargoRespuestaDTO entidad = cargoServicio.actualizar(dto, id);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Cargo actualizado con exito")
                .object(entidad).build(), HttpStatus.CREATED);

    }

    @PatchMapping("/{id}")
    public ResponseEntity<MensajeResponse> cambiarEstado(
            @PathVariable Integer id,
            @RequestParam(name = "estado", required = true) EntidadEstado estado
    ) {

        cargoServicio.cambiarEstado(id, estado);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("ESTADO DEL CARGO CAMBIADO CORRECTAMENTE")
                .build(), HttpStatus.OK);

    }

    @Operation(summary = "Obtener Cargo por ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Cargo encontrado"),
            @ApiResponse(responseCode = "404", description = "Cargo no encontrado")
    })
    @GetMapping("/{id}")
    public ResponseEntity<MensajeResponse> leerPorId(@PathVariable Integer id){

        CargoRespuestaDTO entidad = cargoServicio.entidadPorID(id);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Informacion del cargo solicitado")
                .object(entidad).build(),HttpStatus.OK);

    }

    @GetMapping("resumen")
    public ResponseEntity<MensajeResponse> listaResumen(){

        List<CargoResumenDTO> lista = cargoServicio.listaResumen();

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Lista de cargos")
                .object(lista).build(), HttpStatus.OK);

    }

    @GetMapping("medicos")
    public ResponseEntity<MensajeResponse> listaCargosMedicosResumen(){

        List<CargoMedicoResumenDTO> lista = cargoServicio.listaCargoMedicoResumen();

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Lista de cargos")
                .object(lista).build(), HttpStatus.OK);

    }

}