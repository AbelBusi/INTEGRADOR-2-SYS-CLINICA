package com.salud.consultorio.controller;

import com.salud.consultorio.dto.cargo.CargoMedicoResumenDTO;
import com.salud.consultorio.dto.especialidad.*;
import com.salud.consultorio.model.enums.EntidadEstado;
import com.salud.consultorio.model.payload.MensajeResponse;
import com.salud.consultorio.service.IEspecialidadServicio;
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
@RequestMapping("api/v1/especialidades")
@RequiredArgsConstructor
@Tag(
        name = "Especialidades",
        description = "Endpoints para la gestión de especialidades médicas"
)
public class EspecialidadController {

    private final IEspecialidadServicio especialidadServicio;

    @Operation(summary = "Registrar una nueva especialidad")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Especialidad registrada correctamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos")
    })
    @PostMapping
    public ResponseEntity<MensajeResponse> crearEspecialidad(@Valid @RequestBody EspecialidadCrearDTO especialidadCrearDTO){

        EspecialidadRespuestaDTO especialidad =especialidadServicio.crear(especialidadCrearDTO);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Especialidad agregada con exito")
                .object(especialidad).build(), HttpStatus.CREATED);

    }

    @Operation(summary = "Listar especialidades por estado")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de especialidades obtenida correctamente")
    })
    @GetMapping
    public ResponseEntity<MensajeResponse> listar(
            @RequestParam(required = false,name = "estado") EntidadEstado estado){

        List<EspecialidadRespuestaDTO> listaEntidades =especialidadServicio.lista(estado);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("LISTA DE ESPECIALIDADES")
                .object(listaEntidades).build(),HttpStatus.OK);

    }

    @Operation(summary = "Obtener especialidad por ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Especialidad encontrada"),
            @ApiResponse(responseCode = "404", description = "Especialidad no encontrada")
    })
    @GetMapping("/{id}")
    public ResponseEntity<MensajeResponse> leerEspecialidadPorId(@PathVariable Integer id){

        EspecialidadRespuestaDTO entidad = especialidadServicio.entidadPorID(id);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Informacion del especialidad solicitado")
                .object(entidad).build(),HttpStatus.OK);

    }

    @Operation(summary = "Actualizar especialidad")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Especialidad actualizada correctamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos"),
            @ApiResponse(responseCode = "404", description = "Especialidad no encontrada")
    })
    @PutMapping("/{id}")
    public ResponseEntity<MensajeResponse> actualizarEspecialidad(
            @PathVariable Integer id,
            @Valid @RequestBody EspecialidadActualizarDTO dto){

        EspecialidadRespuestaDTO respuesta = especialidadServicio.actualizar(dto,id);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Especialidad actualizada con exito")
                .object(respuesta).build(), HttpStatus.CREATED);

    }

    @Operation(summary = "Eliminar especialidad")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Especialidad eliminada correctamente"),
            @ApiResponse(responseCode = "404", description = "Especialidad no encontrada")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<MensajeResponse> eliminarEspecialidadPorId(@PathVariable Integer id){

        especialidadServicio.eliminarPorId(id);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Especialidad eliminada con exito")
                .object(null).build(),HttpStatus.NO_CONTENT);

    }

    @PatchMapping("/{id}")
    public ResponseEntity<MensajeResponse> cambiarEstado(
            @PathVariable Integer id,
            @RequestParam(name = "estado", required = true) EntidadEstado estado
    ) {

        especialidadServicio.cambiarEstado(id, estado);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("ESTADO DE LA ESPECIALIDAD CAMBIADA CORRECTAMENTE")
                .build(), HttpStatus.OK);

    }

    @GetMapping("resumen")
    public ResponseEntity<MensajeResponse> listaEspecialidadesResumen(){

        List<EspecialidadResumenDTO> lista = especialidadServicio.listaResumen();

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Lista de especialidades")
                .object(lista).build(), HttpStatus.OK);

    }

}