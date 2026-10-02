package com.salud.consultorio.controller;

import com.salud.consultorio.dto.especialidad.EspecialidadCrearDTO;
import com.salud.consultorio.dto.especialidad.EspecialidadRespuestaDTO;
import com.salud.consultorio.dto.horarioAtencion.HorarioAtencionRespuesta;
import com.salud.consultorio.dto.horarioAtencion.HorarioCrearDTO;
import com.salud.consultorio.model.payload.MensajeResponse;
import com.salud.consultorio.service.IHorarioAtencionServicio;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

}