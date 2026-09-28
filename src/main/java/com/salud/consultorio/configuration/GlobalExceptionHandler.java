package com.salud.consultorio.configuration;

import com.salud.consultorio.auth.exception.AccesoFueraHorarioException;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Map<String,String> handleMethodArgumentNotValidException(MethodArgumentNotValidException e){

        Map<String,String> errorMap= new HashMap<>();

        e.getBindingResult().getAllErrors().forEach( error ->{

            String fieldName = ((FieldError) error).getField();

            String message = error.getDefaultMessage();

            errorMap.put(fieldName,message);

                }
                );

        return errorMap;
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleEntityNotFoundException(EntityNotFoundException e) {
        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("mensaje", e.getMessage());
        respuesta.put("object", null);

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(respuesta);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, Object>> handleDataIntegrityViolationException(DataIntegrityViolationException e) {
        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("mensaje", e.getMessage());
        respuesta.put("object", null);

        return ResponseEntity.status(HttpStatus.CONFLICT).body(respuesta);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalArgumentException(IllegalArgumentException e) {
        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("mensaje", e.getMessage());
        respuesta.put("object", null);

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(respuesta);
    }

    @ExceptionHandler(AccesoFueraHorarioException.class)
    public ResponseEntity<Map<String, Object>> handleAccesoFueraHorarioException(AccesoFueraHorarioException e) {
        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("mensaje", e.getMessage());
        respuesta.put("object", null);

        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(respuesta);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String, Object>> handleBadCredentialsException(BadCredentialsException e) {
        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("mensaje", "La contraseña ingresada es incorrecta");
        respuesta.put("object", null);

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(respuesta);
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleUsernameNotFoundException(UsernameNotFoundException e) {
        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("mensaje", e.getMessage());
        respuesta.put("object", null);

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(respuesta);
    }

}