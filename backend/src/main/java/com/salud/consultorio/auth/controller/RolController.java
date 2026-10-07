package com.salud.consultorio.auth.controller;

import com.salud.consultorio.auth.dto.rol.*;
import com.salud.consultorio.model.enums.EntidadEstado;
import com.salud.consultorio.model.payload.MensajeResponse;
import com.salud.consultorio.service.IRolServicio;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/auth/roles")
@RequiredArgsConstructor
public class RolController {

    private final IRolServicio rolServicio;

    @Operation(summary = "Listar roles por estado")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de roles obtenida correctamente")
    })
    @GetMapping
    public ResponseEntity<MensajeResponse> listar(
            @RequestParam(required = false,name = "estado") EntidadEstado estado){

        List<RolRespuestaDTO> listaEntidades =rolServicio.leerTodos(estado);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("LISTA DE ROLES")
                .object(listaEntidades).build(), HttpStatus.OK);

    }

    @Operation(summary = "Registrar una nuevo cargo")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Cargo registrado correctamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos")
    })
    @PostMapping
    public ResponseEntity<MensajeResponse> crear(@Valid @RequestBody RolCrearDTO dto){

        IRolRespuestaDTO rol = rolServicio.crear(dto);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Cargo agregado con exito")
                .object(rol).build(), HttpStatus.CREATED);

    }

    @Operation(summary = "Actualizar rol")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Rol actualizado correctamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos"),
            @ApiResponse(responseCode = "404", description = "Rol no encontrado")
    })
    @PutMapping("/{id}")
    public ResponseEntity<MensajeResponse> actualizar(
            @PathVariable Integer id,
            @Valid @RequestBody RolActualizarDTO dto){

        IRolRespuestaDTO respuesta = rolServicio.actualizar(dto,id);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Rol actualizado con exito")
                .object(respuesta).build(), HttpStatus.CREATED);

    }

    @PatchMapping("/{id}")
    public ResponseEntity<MensajeResponse> cambiarEstado(
            @PathVariable Integer id,
            @RequestParam(name = "estado", required = true) EntidadEstado estado
    ) {

        rolServicio.cambiarEstado(id, estado);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("ESTADO DEL ROL CAMBIADO CORRECTAMENTE")
                .build(), HttpStatus.OK);

    }

    @Operation(summary = "Eliminar rol")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Rol eliminado correctamente"),
            @ApiResponse(responseCode = "404", description = "Rol no encontrado")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<MensajeResponse> eliminar(@PathVariable Integer id){

        rolServicio.eliminarPorId(id);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Rol eliminado con exito")
                .object(null).build(),HttpStatus.NO_CONTENT);

    }

    @GetMapping("resumen")
    public ResponseEntity<MensajeResponse> listaRolesResumen(){

        List<RolResumenDTO> lista = rolServicio.listaResumen();

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Lista de roles")
                .object(lista).build(), HttpStatus.OK);

    }


}