package com.salud.consultorio.controller;

import com.salud.consultorio.dto.autorizacion.*;
import com.salud.consultorio.model.payload.MensajeResponse;
import com.salud.consultorio.service.IAutorizacionServicio;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/autorizaciones")
@RequiredArgsConstructor
public class AutorizacionController {

    private final IAutorizacionServicio autorizacionServicio;

    @GetMapping("{idRol}")
    public ResponseEntity<MensajeResponse> listaPorRol(
            @PathVariable Integer idRol
    ){

        AutorizacionRolLeer entidad = autorizacionServicio.listarPermisosPorRol(idRol);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Lista de permisos por rol")
                .object(entidad)
                .build(), HttpStatus.OK);

    }

    @GetMapping("/permisos")
    public ResponseEntity<MensajeResponse> listarPermisos() {

        PermisosModulosLeer entidad = autorizacionServicio.listarPermisos();

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Lista de permisos por módulo")
                .object(entidad)
                .build(), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<MensajeResponse> crear(
            @RequestBody AutorizacionCrear dto
    ) {
        AutorizacionRespuesta entidad = autorizacionServicio.crear(dto);

        return new ResponseEntity<>(MensajeResponse.builder()
                        .mensaje("Permisos asignados correctamente al rol")
                        .object(entidad)
                        .build(),HttpStatus.OK
        );
    }

    @PutMapping
    public ResponseEntity<MensajeResponse> sincronizar(
            @RequestBody AutorizacionSincronizar dto
    ) {
        AutorizacionRespuesta entidad = autorizacionServicio.sincronizar(dto);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Permisos asignados correctamente al rol")
                .object(entidad)
                .build(),HttpStatus.OK
        );
    }

}