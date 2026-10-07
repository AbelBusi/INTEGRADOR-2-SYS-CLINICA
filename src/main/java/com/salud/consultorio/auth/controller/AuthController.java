package com.salud.consultorio.auth.controller;

import com.salud.consultorio.auth.dto.*;
import com.salud.consultorio.auth.service.IAuthServicio;
import com.salud.consultorio.auth.service.IRecuperacionClaveServicio;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final IAuthServicio authServicio;
    private final IRecuperacionClaveServicio recuperacionServicio;

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


    @PostMapping("/recuperar-clave")
    public ResponseEntity<MensajeResponse> recuperarClave(@Valid @RequestBody RecuperarClaveRequest dto) {
        recuperacionServicio.solicitarCodigo(dto.usuario(), dto.numeroDocumento(), dto.canal(), dto.destino());
        return ResponseEntity.ok(new MensajeResponse(
                "Si los datos son correctos, se envió un código al medio indicado"));
    }

    @PostMapping("/verificar-codigo")
    public ResponseEntity<MensajeResponse> verificarCodigo(@Valid @RequestBody VerificarCodigoRequest dto) {
        recuperacionServicio.verificarCodigo(dto.usuario(), dto.codigo());
        return ResponseEntity.ok(new MensajeResponse("Código válido"));
    }

    @PostMapping("/restablecer-clave")
    public ResponseEntity<MensajeResponse> restablecerClave(@Valid @RequestBody RestablecerClaveRequest dto) {
        recuperacionServicio.restablecerClave(dto.usuario(), dto.codigo(), dto.nuevaClave());
        return ResponseEntity.ok(new MensajeResponse("Contraseña actualizada correctamente"));
    }

}