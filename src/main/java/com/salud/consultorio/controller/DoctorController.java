package com.salud.consultorio.controller;

import com.salud.consultorio.dto.doctor.*;
import com.salud.consultorio.model.enums.EntidadEstado;
import com.salud.consultorio.model.payload.MensajeResponse;
import com.salud.consultorio.service.IDoctorServicio;
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
@RequestMapping("api/v1/doctores")
@RequiredArgsConstructor
@Tag(
        name = "Doctores",
        description = "Endpoints para la gestión de doctores"
)
public class DoctorController {

    private final IDoctorServicio doctorServicio;

    @Operation(summary = "Registrar un doctor a partir de un empleado existente")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Doctor registrado correctamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos o empleado no activo"),
            @ApiResponse(responseCode = "404", description = "Empleado o especialidad no encontrados"),
            @ApiResponse(responseCode = "409", description = "El empleado ya es doctor o la colegiatura está duplicada")
    })
    @PostMapping
    public ResponseEntity<MensajeResponse> crearDoctor(
            @Valid @RequestBody DoctorCrearDTO doctorCrearDTO) {

        DoctorRespuestaDTO doctor = doctorServicio.crear(doctorCrearDTO);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Doctor agregado con exito")
                .object(doctor).build(), HttpStatus.CREATED);

    }

    @Operation(summary = "Listar doctores", description = "Si no se envía el estado, devuelve los doctores activos e inactivos")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de doctores obtenida correctamente")
    })
    @GetMapping
    public ResponseEntity<MensajeResponse> listarDoctores(
            @Parameter(description = "Filtro opcional por estado (ACTIVO o INACTIVO)")
            @RequestParam(name = "estado", required = false) EntidadEstado estado) {

        List<DoctorLeerDTO> listaDoctores = doctorServicio.lista(estado);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje(estado == null ? "LISTA DE DOCTORES" : "LISTA DE DOCTORES POR ESTADO: " + estado)
                .object(listaDoctores).build(), HttpStatus.OK);

    }

    @Operation(summary = "Obtener doctor por ID", description = "Incluye datos de persona, empleado, cargo y especialidad")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Doctor encontrado"),
            @ApiResponse(responseCode = "400", description = "ID inválido"),
            @ApiResponse(responseCode = "404", description = "Doctor no encontrado")
    })
    @GetMapping("/{id}")
    public ResponseEntity<MensajeResponse> leerDoctorPorId(
            @PathVariable Integer id) {

        DoctorDetalleDTO dto = doctorServicio.entidadPorID(id);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("DOCTOR ENCONTRADO")
                .object(dto).build(), HttpStatus.OK);

    }

    @Operation(summary = "Actualizar doctor", description = "Solo actualiza datos propios del doctor (especialidad, colegiatura, etc.)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Doctor actualizado correctamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos o doctor eliminado"),
            @ApiResponse(responseCode = "404", description = "Doctor o especialidad no encontrados"),
            @ApiResponse(responseCode = "409", description = "Número de colegiatura duplicado")
    })
    @PutMapping("/{id}")
    public ResponseEntity<MensajeResponse> actualizar(
            @PathVariable Integer id,
            @Valid @RequestBody DoctorActualizarDTO dto) {

        DoctorRespuestaDTO doctor = doctorServicio.actualizar(dto, id);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Doctor actualizado con exito")
                .object(doctor).build(), HttpStatus.OK);

    }

    @Operation(summary = "Activar o desactivar doctor")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Estado del doctor cambiado correctamente"),
            @ApiResponse(responseCode = "400", description = "Estado inválido, doctor eliminado, ya está en ese estado o su empleado no está activo"),
            @ApiResponse(responseCode = "404", description = "Doctor no encontrado")
    })
    @PatchMapping("/{id}")
    public ResponseEntity<MensajeResponse> cambiarEstado(
            @PathVariable Integer id,
            @Parameter(description = "Nuevo estado (ACTIVO o INACTIVO)", required = true)
            @RequestParam(name = "estado") EntidadEstado estado) {

        doctorServicio.cambiarEstado(id, estado);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("ESTADO DEL DOCTOR CAMBIADO CORRECTAMENTE")
                .build(), HttpStatus.OK);

    }

    @Operation(summary = "Eliminar doctor", description = "Eliminación lógica (estado = 0)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Doctor eliminado correctamente"),
            @ApiResponse(responseCode = "400", description = "El doctor ya se encuentra eliminado"),
            @ApiResponse(responseCode = "404", description = "Doctor no encontrado")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<MensajeResponse> eliminarDoctor(@PathVariable Integer id) {

        doctorServicio.eliminarPorId(id);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Doctor eliminado con exito")
                .build(), HttpStatus.OK);

    }

}