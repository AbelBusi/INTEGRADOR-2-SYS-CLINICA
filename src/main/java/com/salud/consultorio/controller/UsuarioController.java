package com.salud.consultorio.controller;

import com.salud.consultorio.service.IUsuarioServicio;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

}