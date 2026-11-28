package com.salud.consultorio.controller;

import com.salud.consultorio.model.payload.MensajeResponse;
import com.salud.consultorio.service.IDescansoMedicoVerificacionServicio;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/publico/descansos-medicos")
@RequiredArgsConstructor
@Tag(name = "Verificación pública de descansos médicos",
        description = "Endpoint sin autenticación: valida un documento mediante el identificador del código QR")
public class DescansoMedicoPublicoController {

    private final IDescansoMedicoVerificacionServicio verificacionServicio;

    @Operation(summary = "Verificar un descanso médico",
            description = "Devuelve VIGENTE, CANCELADO, ALTERADO o NO_ENCONTRADO con datos mínimos y parcialmente ocultos. " +
                    "Nunca devuelve información clínica.")
    @GetMapping("/verificar/{codigo}")
    public ResponseEntity<MensajeResponse> verificar(@PathVariable String codigo) {
        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("VERIFICACION DE DESCANSO MEDICO")
                .object(verificacionServicio.verificar(codigo)).build(), HttpStatus.OK);
    }
}