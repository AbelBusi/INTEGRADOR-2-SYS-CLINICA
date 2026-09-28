package com.salud.consultorio.controller;

import com.salud.consultorio.dto.comunicado.ComunicadoCrearDTO;
import com.salud.consultorio.dto.comunicado.ComunicadoLeerDTO;
import com.salud.consultorio.model.payload.MensajeResponse;
import com.salud.consultorio.service.IComunicadoServicio;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/comunicados")
@RequiredArgsConstructor
@Tag(
        name = "Comunicados",
        description = "Endpoints para los comunicados de la clínica"
)
public class ComunicadoController {

    private final IComunicadoServicio comunicadoServicio;

    @Operation(summary = "Listar comunicados activos")
    @GetMapping
    public ResponseEntity<MensajeResponse> listar() {
        List<ComunicadoLeerDTO> comunicados = comunicadoServicio.listar();
        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("LISTA DE COMUNICADOS")
                .object(comunicados).build(), HttpStatus.OK);
    }

    @Operation(summary = "Registrar un comunicado")
    @PostMapping
    public ResponseEntity<MensajeResponse> crear(@Valid @RequestBody ComunicadoCrearDTO dto) {
        ComunicadoLeerDTO comunicado = comunicadoServicio.crear(dto);
        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Comunicado registrado con exito")
                .object(comunicado).build(), HttpStatus.CREATED);
    }

}
