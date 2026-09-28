package com.salud.consultorio.controller;

import com.salud.consultorio.dto.doctor.DoctorEspecialidadLeerDTO;
import com.salud.consultorio.dto.recepcionista.*;
import com.salud.consultorio.model.entity.Recepcionista;
import com.salud.consultorio.model.enums.EntidadEstado;
import com.salud.consultorio.model.payload.MensajeResponse;
import com.salud.consultorio.service.IRecepcionistaServicio;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/recepcionistas")
@RequiredArgsConstructor
@Tag(
        name = "Recepcionistas",
        description = "Endpoints para la gestión de recepcionistas"
)
public class RecepcionistaController {

    private final IRecepcionistaServicio recepcionistaServicio;

    @Operation(summary = "Registrar un nuevo recepcionista")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Recepcionista registrado correctamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos")
    })
    @PostMapping
    public ResponseEntity<MensajeResponse> crear(@Valid @RequestBody RecepcionistaCrearDTO recepcionistaCrearDTO){

        RecepcionistaRespuestaDTO recepcionista = recepcionistaServicio.crear(recepcionistaCrearDTO);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Recepcionista agregado con exito")
                .object(recepcionista).build(), HttpStatus.CREATED);

    }

    @Operation(summary = "Listar nombres de recepcionistas")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de nombres obtenida correctamente"),
            @ApiResponse(responseCode = "404", description = "No existen recepcionistas")
    })
    @GetMapping("/resumen")
    public ResponseEntity<MensajeResponse> listaNombres() {
        List<NombreRecepcionistaDTO> leerRecepcionistaDTOS = recepcionistaServicio.listaNombres();

        if (leerRecepcionistaDTOS == null) {

            return new ResponseEntity<>(MensajeResponse.builder()
                    .mensaje("No existen recepcionistas todavia")
                    .object(null).build(), HttpStatus.NOT_FOUND);

        }
        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("LISTA DE RECEPCIONISTAS")
                .object(leerRecepcionistaDTOS).build(), HttpStatus.OK);
    }

    @Operation(summary = "Actualizar recepcionista")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Recepcionista actualizado correctamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos"),
            @ApiResponse(responseCode = "404", description = "Recepcionista no encontrado")
    })
    @PutMapping("/{id}")
    public ResponseEntity<MensajeResponse> actualizar(@PathVariable Integer id,@Valid @RequestBody RecepcionistaActualizarDTO dto){

        RecepcionistaRespuestaDTO actualizar = recepcionistaServicio.actualizar(dto,id);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("EL RECEPCIONISTA FUE ACTUALIZADO CON EXITO")
                .object(actualizar).build(),HttpStatus.OK);

    }

    @Operation(summary = "Listar recepcionistas")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de recepcionistas obtenida correctamente")
    })
    @GetMapping
    public ResponseEntity<MensajeResponse> leerRecepcionistas(
            @RequestParam(required = false,name = "estado") EntidadEstado estado){

        if (estado!=null){

            if (estado.equals(estado.ACTIVO)){
                List<RecepcionistaLeerDTO> recepcionistas =recepcionistaServicio.listarRecepcionistasActivos();
                return new ResponseEntity<>(MensajeResponse.builder()
                        .mensaje("LISTA DE RECEPCIONISTAS POR ESTADO ACTIVO")
                        .object(recepcionistas).build(),HttpStatus.OK);
            }

            if (estado.equals(estado.INACTIVO)){
                List<RecepcionistaLeerDTO> recepcionistas =recepcionistaServicio.listarRecepcionistasInactivos();
                return new ResponseEntity<>(MensajeResponse.builder()
                        .mensaje("LISTA DE RECEPCIONISTAS POR ESTADO INACTIVO")
                        .object(recepcionistas).build(),HttpStatus.OK);
            }

        }
        List<RecepcionistaLeerDTO> recepcionistas =recepcionistaServicio.listarRecepcionistasPersonas();

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("LISTA DE RECEPCIONISTAS")
                .object(recepcionistas).build(),HttpStatus.OK);

    }

    @Operation(summary = "Obtener el recepcionista del usuario autenticado")
    @GetMapping("/actual")
    public ResponseEntity<MensajeResponse> recepcionistaActual(Authentication authentication){

        Recepcionista recepcionista = recepcionistaServicio.obtenerPorUsuario(authentication.getName())
                .orElseThrow(() -> new EntityNotFoundException("El usuario autenticado no es un recepcionista"));

        RecepcionistaLeerDTO leer = recepcionistaServicio.leerPorId(recepcionista.getId());

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Recepcionista autenticado")
                .object(leer).build(), HttpStatus.OK);

    }

    @Operation(summary = "Obtener recepcionista por ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Recepcionista encontrado"),
            @ApiResponse(responseCode = "404", description = "Recepcionista no encontrado")
    })
    @GetMapping("/{id}")
    public ResponseEntity<MensajeResponse> leerRecepcionistaPorId(@PathVariable Integer id){

        RecepcionistaDetalleLeerDTO leer = recepcionistaServicio.obtenerDetallePorId(id);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Informacion del recepcionista solicitado")
                .object(leer).build(),HttpStatus.OK);

    }

    @Operation(summary = "Eliminar recepcionista")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Recepcionista eliminado correctamente"),
            @ApiResponse(responseCode = "404", description = "Recepcionista no encontrado")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<MensajeResponse> eliminarRecepcionistaPorId(@PathVariable Integer id){

        recepcionistaServicio.eliminarPorId(id);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Recepcionista eliminado con exito")
                .object(null).build(),HttpStatus.NO_CONTENT);

    }
}