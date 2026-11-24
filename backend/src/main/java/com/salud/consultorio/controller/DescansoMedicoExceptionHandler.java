package com.salud.consultorio.controller;

import com.salud.consultorio.model.payload.MensajeResponse;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice(assignableTypes = DescansoMedicoController.class)
@Order(Ordered.HIGHEST_PRECEDENCE)
public class DescansoMedicoExceptionHandler {

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<MensajeResponse> manejar(ResponseStatusException ex) {
        return new ResponseEntity<>(MensajeResponse.builder().mensaje(ex.getReason()).build(), ex.getStatusCode());
    }
}