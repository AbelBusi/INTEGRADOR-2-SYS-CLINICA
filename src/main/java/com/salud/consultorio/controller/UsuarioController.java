package com.salud.consultorio.controller;

import com.salud.consultorio.dto.usuario.UsuarioListadoDTO;
import com.salud.consultorio.model.enums.EntidadEstado;
import com.salud.consultorio.model.payload.MensajeResponse;
import com.salud.consultorio.service.IUsuarioServicio;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/v1/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final IUsuarioServicio usuarioServicio;

    @GetMapping("/{id}/rol")
    public ResponseEntity<Map<String, Object>> obtenerUsuarioYRol(@PathVariable Integer id) {
        return usuarioServicio.obtenerInformacionUsuarioYRol(id)
                .map(info -> ResponseEntity.ok(Map.of(
                        "mensaje", "Usuario encontrado",
                        "object", info)))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("mensaje", "Usuario no encontrado")));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<MensajeResponse> cambiarEstado(
            @PathVariable Integer id,
            @RequestParam(name = "estado", required = true) EntidadEstado estado
    ) {

        usuarioServicio.cambiarEstado(id, estado);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("ESTADO DEL USUARIO CAMBIADO CORRECTAMENTE")
                .build(), HttpStatus.OK);

    }

    @Operation(summary = "Listar usuarios por estado")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de usuarios obtenida correctamente")
    })
    @GetMapping
    public ResponseEntity<MensajeResponse> listar(
            @RequestParam(required = false,name = "estado") EntidadEstado estado){

        List<UsuarioListadoDTO> listaEntidades =usuarioServicio.lista(estado);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("LISTA DE USUARIOS")
                .object(listaEntidades).build(),HttpStatus.OK);

    }

    @Operation(summary = "Listar usuarios por estado")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de usuarios obtenida correctamente")
    })
    @GetMapping("empleados")
    public ResponseEntity<MensajeResponse> listarEmpleados(
            @RequestParam(required = false,name = "estado") EntidadEstado estado){

        List<UsuarioListadoDTO> listaEntidades =usuarioServicio.listaEmpleados(estado);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("LISTA DE USUARIOS")
                .object(listaEntidades).build(),HttpStatus.OK);

    }

    @Operation(summary = "Listar usuarios por estado")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de usuarios obtenida correctamente")
    })
    @GetMapping("pacientes")
    public ResponseEntity<MensajeResponse> listarPacientes(
            @RequestParam(required = false,name = "estado") EntidadEstado estado){

        List<UsuarioListadoDTO> listaEntidades =usuarioServicio.listaPacientes(estado);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("LISTA DE USUARIOS")
                .object(listaEntidades).build(),HttpStatus.OK);

    }

}