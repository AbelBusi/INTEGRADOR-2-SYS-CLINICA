package com.salud.consultorio.controller;

import com.salud.consultorio.dto.empleado.*;
import com.salud.consultorio.model.enums.EntidadEstado;
import com.salud.consultorio.model.payload.MensajeResponse;
import com.salud.consultorio.service.IEmpleadoServicio;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("api/v1/empleados")
@RequiredArgsConstructor
@Tag(
        name = "Empleados",
        description = "Endpoints para la gestión de empleados"
)
public class EmpleadoController {

    private final IEmpleadoServicio empleadoServicio;

    @Operation(summary = "Registrar un nuevo empleado")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Empleado registrado correctamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos"),
            @ApiResponse(responseCode = "404", description = "El cargo no existe o no está activo"),
            @ApiResponse(responseCode = "409", description = "Datos duplicados")
    })
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<MensajeResponse> crearEmpleado(
            @Valid @RequestPart("empleado") EmpleadoCrearDTO empleadoCrearDTO,
            @RequestPart(value = "imagen", required = false)MultipartFile imagen) {

        EmpleadoRespuestaDTO empleado = empleadoServicio.crear(empleadoCrearDTO, imagen);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Empleado agregado con exito")
                .object(empleado).build(), HttpStatus.CREATED);

    }

    @Operation(summary = "Listar empleados", description = "Si no se envía el estado, devuelve los empleados activos e inactivos")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de empleados obtenida correctamente")
    })
    @GetMapping
    public ResponseEntity<MensajeResponse> listarEmpleados(
            @Parameter(description = "Filtro opcional por estado (ACTIVO o INACTIVO)")
            @RequestParam(name = "estado", required = false) EntidadEstado estado) {

        List<EmpleadoLeerDTO> listaEmpleados = empleadoServicio.lista(estado);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje(estado == null ? "LISTA DE EMPLEADOS" : "LISTA DE EMPLEADOS POR ESTADO: " + estado)
                .object(listaEmpleados).build(), HttpStatus.OK);

    }

    @Operation(summary = "Obtener empleado por ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Empleado encontrado"),
            @ApiResponse(responseCode = "400", description = "ID inválido"),
            @ApiResponse(responseCode = "404", description = "Empleado no encontrado")
    })
    @GetMapping("/{id}")
    public ResponseEntity<MensajeResponse> leerEmpleadoPorId(
            @PathVariable Integer id) {

        EmpleadoDetalleDTO dto = empleadoServicio.entidadPorID(id);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("EMPLEADO ENCONTRADO")
                .object(dto).build(), HttpStatus.OK);

    }

    @Operation(summary = "Actualizar empleado")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Empleado actualizado correctamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos"),
            @ApiResponse(responseCode = "404", description = "Empleado o cargo no encontrado"),
            @ApiResponse(responseCode = "409", description = "Datos duplicados")
    })
    @PutMapping("/{id}")
    public ResponseEntity<MensajeResponse> actualizar(
            @PathVariable Integer id,
            @Valid @RequestPart("empleado") EmpleadoActualizarDTO dto,
            @RequestPart(value = "imagen", required = false) MultipartFile file) {

        EmpleadoRespuestaDTO empleado = empleadoServicio.actualizar(dto, id, file);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Empleado actualizado con exito")
                .object(empleado).build(), HttpStatus.OK);

    }

    @Operation(summary = "Activar o desactivar empleado")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Estado del empleado cambiado correctamente"),
            @ApiResponse(responseCode = "400", description = "Estado inválido, empleado eliminado o ya se encuentra en ese estado"),
            @ApiResponse(responseCode = "404", description = "Empleado no encontrado")
    })
    @PatchMapping("/{id}")
    public ResponseEntity<MensajeResponse> cambiarEstado(
            @PathVariable Integer id,
            @Parameter(description = "Nuevo estado (ACTIVO o INACTIVO)", required = true)
            @RequestParam(name = "estado") EntidadEstado estado) {

        empleadoServicio.cambiarEstado(id, estado);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("ESTADO DEL EMPLEADO CAMBIADO CORRECTAMENTE")
                .build(), HttpStatus.OK);

    }

    @Operation(summary = "Eliminar empleado", description = "Eliminación lógica (estado = 0)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Empleado eliminado correctamente"),
            @ApiResponse(responseCode = "400", description = "El empleado ya se encuentra eliminado"),
            @ApiResponse(responseCode = "404", description = "Empleado no encontrado")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<MensajeResponse> eliminarEmpleado(@PathVariable Integer id) {

        empleadoServicio.eliminarPorId(id);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Empleado eliminado con exito")
                .build(), HttpStatus.OK);

    }

}