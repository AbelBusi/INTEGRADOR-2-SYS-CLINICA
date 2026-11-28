package com.salud.consultorio.controller;

import com.salud.consultorio.dto.examenMedico.ExamenMedicoRequestDTO;
import com.salud.consultorio.dto.examenMedico.ExamenMedicoRespuestaDTO;
import com.salud.consultorio.service.IExamenMedicoServicio;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/examenes-medicos")
@RequiredArgsConstructor
public class ExamenMedicoController {

    private final IExamenMedicoServicio servicio;

    @GetMapping
    public ResponseEntity<Map<String, Object>> listar(@RequestParam(required = false) String estado) {
        return ResponseEntity.ok(respuesta("Exámenes médicos listados correctamente", servicio.listar(estado)));
    }

    @GetMapping("/buscar")
    public ResponseEntity<Map<String, Object>> buscarPorNombre(@RequestParam(required = false) String busqueda) {
        return ResponseEntity.ok(respuesta("Búsqueda realizada correctamente", servicio.buscarPorNombre(busqueda)));
    }

    @GetMapping("/resumen")
    public ResponseEntity<Map<String, Object>> listarResumen() {
        return ResponseEntity.ok(respuesta("Catálogo de exámenes listado correctamente", servicio.listarResumen()));
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> crear(@RequestBody ExamenMedicoRequestDTO request) {
        ExamenMedicoRespuestaDTO creado = servicio.crear(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(respuesta("Examen médico registrado con éxito", creado));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> actualizar(@PathVariable Integer id,
                                                          @RequestBody ExamenMedicoRequestDTO request) {
        return ResponseEntity.ok(respuesta("Examen médico actualizado con éxito", servicio.actualizar(id, request)));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Map<String, Object>> cambiarEstado(@PathVariable Integer id,
                                                             @RequestParam String estado) {
        servicio.cambiarEstado(id, estado);
        boolean activo = "activo".equalsIgnoreCase(estado);
        return ResponseEntity.ok(respuesta(
                activo ? "Examen médico activado con éxito" : "Examen médico desactivado con éxito", null));
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, Object>> manejarError(ResponseStatusException ex) {
        return ResponseEntity.status(ex.getStatusCode()).body(respuesta(ex.getReason(), null));
    }

    private Map<String, Object> respuesta(String mensaje, Object object) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("mensaje", mensaje);
        body.put("object", object);
        return body;
    }
}