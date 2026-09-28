package com.salud.consultorio.controller;

import com.salud.consultorio.dto.rol.RolRespuestaDTO;
import com.salud.consultorio.model.payload.MensajeResponse;
import com.salud.consultorio.service.IRolServicio;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/v1/roles")
@RequiredArgsConstructor
@Tag(
        name = "Roles",
        description = "Endpoints para la gestión de roles del sistema"
)
public class RolController {

    private final IRolServicio rolServicio;

    @Operation(summary = "Listar todos los roles")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de roles obtenida correctamente")
    })
    @GetMapping
    public ResponseEntity<MensajeResponse> lista(){

        List<RolRespuestaDTO> lista = rolServicio.leerTodos();

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("LISTA DE TODOS LOS ROLES DE LA ENTIDAD")
                .object(lista).build()
                , HttpStatus.OK);

    }

}