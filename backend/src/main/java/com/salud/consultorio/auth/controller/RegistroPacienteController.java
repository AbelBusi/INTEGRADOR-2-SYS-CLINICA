package com.salud.consultorio.auth.controller;

import com.salud.consultorio.auth.dto.registro.*;
import com.salud.consultorio.auth.service.IAutorregistroPacienteServicio;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/auth/registro")
@RequiredArgsConstructor
public class RegistroPacienteController {

    private final IAutorregistroPacienteServicio autorregistroServicio;

    @PostMapping("/elegibilidad")
    public ResponseEntity<ElegibilidadResponse> elegibilidad(
            @Valid @RequestBody ElegibilidadRegistroRequest dto) {
        return ResponseEntity.ok(autorregistroServicio.consultarElegibilidad(dto));
    }

    @PostMapping("/enviar-codigo")
    public ResponseEntity<CodigoEnviadoResponse> enviarCodigo(
            @Valid @RequestBody EnviarCodigoRegistroRequest dto) {
        return ResponseEntity.ok(autorregistroServicio.enviarCodigo(dto));
    }

    @PostMapping("/completar")
    public ResponseEntity<RegistroCompletadoResponse> completar(
            @Valid @RequestBody CompletarRegistroRequest dto) {
        return ResponseEntity.ok(autorregistroServicio.completar(dto));
    }

    @PostMapping("/verificar-identidad")
    public ResponseEntity<ElegibilidadResponse> verificarIdentidad(
            @Valid @RequestBody VerificarIdentidadRequest dto) {
        return ResponseEntity.ok(autorregistroServicio.verificarIdentidad(dto));
    }
}