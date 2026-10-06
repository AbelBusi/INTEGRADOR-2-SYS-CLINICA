package com.salud.consultorio.controller;

import com.salud.consultorio.dto.especialidad.EspecialidadRespuestaDTO;
import com.salud.consultorio.dto.horarioAtencion.*;
import com.salud.consultorio.model.payload.MensajeResponse;
import com.salud.consultorio.service.IHorarioAtencionServicio;
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
@RequestMapping("api/v1/horarios")
@RequiredArgsConstructor
public class HorarioAtencionController {

    private final IHorarioAtencionServicio horarioAtencionServicio;

    @Operation(summary = "Registrar un nuevo horario")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Horario registrado correctamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos")
    })
    @PostMapping
    public ResponseEntity<MensajeResponse> crear(@Valid @RequestBody HorarioCrearDTO dto){

        HorarioAtencionRespuesta entidad = horarioAtencionServicio.crear(dto);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Horarios agregados con exito")
                .object(entidad).build(), HttpStatus.CREATED);

    }

    @Operation(summary = "Obtener horario por ID del empleado")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Horario encontrada"),
            @ApiResponse(responseCode = "404", description = "Horario no encontrada")
    })
    @GetMapping("/{id}")
    public ResponseEntity<MensajeResponse> leerPorId(@PathVariable Integer id){

        EmpleadoHorarioRespuesta entidad = horarioAtencionServicio.obtenerPorID(id);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Informacion del horario del empleado solicitado")
                .object(entidad).build(),HttpStatus.OK);

    }

    @Operation(summary = "Obtener horarios")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Horarios encontrados"),
            @ApiResponse(responseCode = "404", description = "Horarios no encontrados")
    })
    @GetMapping()
    public ResponseEntity<MensajeResponse> listar(){

        List<HorarioAtencionResumenDTO> lista = horarioAtencionServicio.lista();

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Informacion del horario del empleado solicitado")
                .object(lista).build(),HttpStatus.OK);

    }

}