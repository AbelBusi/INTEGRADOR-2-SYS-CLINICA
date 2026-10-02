package com.salud.consultorio.controller;


import com.salud.consultorio.dto.paciente.*;
import com.salud.consultorio.model.enums.EntidadEstado;
import com.salud.consultorio.model.payload.MensajeResponse;
import com.salud.consultorio.service.IPacienteServicio;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/pacientes")
@RequiredArgsConstructor
@Tag(
        name = "Pacientes",
        description = "Endpoints para la gestión de pacientes"
)
public class PacienteController {

    private final IPacienteServicio pacienteServicio;

    @Operation(summary = "Registrar un nuevo paciente")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Paciente registrado correctamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos")
    })
    @PostMapping
    public ResponseEntity<MensajeResponse> crearPaciente(@Valid @RequestBody PacienteCrearDTO pacienteCrearDTO) {

        PacienteRespuestaDTO paciente = pacienteServicio.crear(pacienteCrearDTO);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Paciente agregado con exito")
                .object(paciente).build(), HttpStatus.CREATED);

    }

    @Operation(summary = "Listar pacientes")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de pacientes obtenida correctamente"),
            @ApiResponse(responseCode = "204", description = "No existen pacientes")
    })
    @GetMapping
    public ResponseEntity<MensajeResponse> listarPacientes(
            @RequestParam(name = "estado", required = false) EntidadEstado estado) {

        List<PacienteLeerDTO> listaPacientes = pacienteServicio.lista(estado);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje(estado == null ? "LISTA DE PACIENTES" : "LISTA DE PACIENTES POR ESTADO: " + estado)
                .object(listaPacientes).build(), HttpStatus.OK);

    }

    @Operation(summary = "Obtener paciente por ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Paciente encontrado"),
            @ApiResponse(responseCode = "404", description = "Paciente no encontrado")
    })
    @GetMapping("/{id}")
    public ResponseEntity<MensajeResponse> leerPacientePorId(
            @PathVariable Integer id) {

        PacienteDetalleDTO dto = pacienteServicio.entidadPorID(id);

        return new ResponseEntity<>(
                MensajeResponse.builder()
                        .mensaje("PACIENTE ENCONTRADO")
                        .object(dto)
                        .build(), HttpStatus.OK);
    }

    @Operation(summary = "Actualizar paciente")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Paciente actualizado correctamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos"),
            @ApiResponse(responseCode = "404", description = "Paciente no encontrado")
    })
    @PutMapping("/{id}")
    public ResponseEntity<MensajeResponse> actualizar(
            @PathVariable Integer id,
            @Valid @RequestBody PacienteActualizarDTO dto) {

        PacienteRespuestaDTO paciente = pacienteServicio.actualizar(dto, id);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Paciente actualizado con exito")
                .object(paciente).build(), HttpStatus.CREATED);

    }

    @PatchMapping("/{id}")
    public ResponseEntity<MensajeResponse> cambiarEstado(
            @PathVariable Integer id,
            @RequestParam(name = "estado", required = true) EntidadEstado estado
    ) {

        pacienteServicio.cambiarEstado(id, estado);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("ESTADO DEL PACIENTE CAMBIADO CORRECTAMENTE")
                .build(), HttpStatus.OK);

    }

    @Operation(summary = "Eliminar paciente")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Paciente eliminado correctamente"),
            @ApiResponse(responseCode = "404", description = "Paciente no encontrado")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<MensajeResponse> eliminarPaciente(@PathVariable Integer id) {

        pacienteServicio.eliminarPorId(id);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Paciente eliminado con exito")
                .object(null).build(), HttpStatus.NO_CONTENT);

    }

}