package com.salud.consultorio.controller;

import com.salud.consultorio.dto.medico.*;
import com.salud.consultorio.model.enums.EntidadEstado;
import com.salud.consultorio.model.payload.MensajeResponse;
import com.salud.consultorio.service.IMedicoServicio;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
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
@RequestMapping("api/v1/medicos")
@RequiredArgsConstructor
@Tag(
        name = "Medicos",
        description = "Endpoints para la gestión de medicos"
)
public class MedicoController {

    private final IMedicoServicio medicoServicio;

    @Operation(summary = "Registrar un medico a partir de un empleado existente")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Medico registrado correctamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos o empleado no activo"),
            @ApiResponse(responseCode = "404", description = "Empleado o especialidad no encontrados"),
            @ApiResponse(responseCode = "409", description = "El empleado ya es medico o la colegiatura está duplicada")
    })
    @PostMapping
    public ResponseEntity<MensajeResponse> crearMedico(
            @Valid @RequestBody MedicoCrearDTO medicoCrearDTO) {

        MedicoRespuestaDTO doctor = medicoServicio.crear(medicoCrearDTO);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Doctor agregado con exito")
                .object(doctor).build(), HttpStatus.CREATED);

    }

    @Operation(summary = "Listar Medicos", description = "Si no se envía el estado, devuelve los medicos activos e inactivos")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de medicos obtenida correctamente")
    })
    @GetMapping
    public ResponseEntity<MensajeResponse> listarMedicos(
            @Parameter(description = "Filtro opcional por estado (ACTIVO o INACTIVO)")
            @RequestParam(name = "estado", required = false) EntidadEstado estado) {

        List<MedicoLeerDTO> listaDoctores = medicoServicio.lista(estado);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje(estado == null ? "LISTA DE MEDICOS" : "LISTA DE MEDICOS POR ESTADO: " + estado)
                .object(listaDoctores).build(), HttpStatus.OK);

    }

    @Operation(summary = "Obtener Medico por ID", description = "Incluye datos de persona, empleado, cargo y especialidad")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Medico encontrado"),
            @ApiResponse(responseCode = "400", description = "ID inválido"),
            @ApiResponse(responseCode = "404", description = "Medico no encontrado")
    })
    @GetMapping("/{id}")
    public ResponseEntity<MensajeResponse> leerMedicoPorId(
            @PathVariable Integer id) {

        MedicoDetalleDTO dto = medicoServicio.entidadPorID(id);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("MEDICO ENCONTRADO")
                .object(dto).build(), HttpStatus.OK);

    }

    @Operation(summary = "Actualizar medico", description = "Solo actualiza datos propios del doctor (especialidad, colegiatura, etc.)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Medico actualizado correctamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos o medico eliminado"),
            @ApiResponse(responseCode = "404", description = "Medico o especialidad no encontrados"),
            @ApiResponse(responseCode = "409", description = "Número de colegiatura duplicado")
    })
    @PutMapping("/{id}")
    public ResponseEntity<MensajeResponse> actualizar(
            @PathVariable Integer id,
            @Valid @RequestBody MedicoActualizarDTO dto) {

        MedicoRespuestaDTO doctor = medicoServicio.actualizar(dto, id);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Medico actualizado con exito")
                .object(doctor).build(), HttpStatus.OK);

    }

    @Operation(summary = "Activar o desactivar medico")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Estado del medico cambiado correctamente"),
            @ApiResponse(responseCode = "400", description = "Estado inválido, medico eliminado, ya está en ese estado o su empleado no está activo"),
            @ApiResponse(responseCode = "404", description = "Medico no encontrado")
    })
    @PatchMapping("/{id}")
    public ResponseEntity<MensajeResponse> cambiarEstado(
            @PathVariable Integer id,
            @Parameter(description = "Nuevo estado (ACTIVO o INACTIVO)", required = true)
            @RequestParam(name = "estado") EntidadEstado estado) {

        medicoServicio.cambiarEstado(id, estado);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("ESTADO DEL MEDICO CAMBIADO CORRECTAMENTE")
                .build(), HttpStatus.OK);

    }

    @Operation(summary = "Eliminar medico", description = "Eliminación lógica (estado = 0)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Doctor eliminado correctamente"),
            @ApiResponse(responseCode = "400", description = "El medico ya se encuentra eliminado"),
            @ApiResponse(responseCode = "404", description = "Medico no encontrado")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<MensajeResponse> eliminarMedico(@PathVariable Integer id) {

        medicoServicio.eliminarPorId(id);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Medico eliminado con exito")
                .build(), HttpStatus.OK);

    }

    @Operation(summary = "Verificar disponibilidad de numero de colegiatura y de especialidad")
    @GetMapping("/disponibilidad")
    public ResponseEntity<MensajeResponse> verificarDisponibilidad(
            @RequestParam String numeroColegiatura,
            @RequestParam(required = false) String numeroEspecialidad) {

        DisponibilidadCodigosDTO dto = medicoServicio.verificarDisponibilidad(numeroColegiatura, numeroEspecialidad);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("DISPONIBILIDAD DE CODIGOS")
                .object(dto).build(), HttpStatus.OK);

    }

}