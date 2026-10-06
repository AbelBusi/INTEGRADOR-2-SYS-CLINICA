package com.salud.consultorio.auth.controller;

import com.salud.consultorio.auth.dto.rol.RolRespuestaDTO;
import com.salud.consultorio.dto.especialidad.EspecialidadRespuestaDTO;
import com.salud.consultorio.model.enums.EntidadEstado;
import com.salud.consultorio.model.payload.MensajeResponse;
import com.salud.consultorio.service.IRolServicio;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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


}