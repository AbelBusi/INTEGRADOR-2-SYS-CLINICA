package com.salud.consultorio.auth.controller;

import com.salud.consultorio.auth.dto.InicioSolicitud;
import com.salud.consultorio.auth.dto.TokenResponse;
import com.salud.consultorio.auth.dto.UsuarioCrearDTO;
import com.salud.consultorio.auth.service.IAuthServicio;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final IAuthServicio authServicio;

    @PostMapping("/register")
    public ResponseEntity<TokenResponse> registrar(
            @RequestBody UsuarioCrearDTO dto
            ){

        final TokenResponse token = authServicio.registrar(dto);

        return ResponseEntity.ok(token);

    }

    @PostMapping("/login")
    public ResponseEntity<TokenResponse> autenticar(
            @RequestBody final InicioSolicitud dto
            ){

        final TokenResponse token = authServicio.ingresar(dto);

        return ResponseEntity.ok(token);

    }

    @PostMapping("/refresh")
    public TokenResponse refrescarToken(
            @RequestHeader(HttpHeaders.AUTHORIZATION) final String authHeader){

        return authServicio.refrescarToken(authHeader);

    }

}