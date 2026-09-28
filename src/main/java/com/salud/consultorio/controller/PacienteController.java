package com.salud.consultorio.controller;

import com.salud.consultorio.dto.paciente.*;
import com.salud.consultorio.dto.paciente.NombrePacientesDTO;
import com.salud.consultorio.model.enums.EntidadEstado;
import com.salud.consultorio.model.payload.MensajeResponse;
import com.salud.consultorio.model.entity.Paciente;
import com.salud.consultorio.service.IPacienteServicio;
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
    public ResponseEntity<MensajeResponse> crearPaciente(@Valid @RequestBody PacienteCrearDTO pacienteCrearDTO){

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
            @RequestParam(name = "estado",required = false) EntidadEstado pacienteEstado) {

        if (pacienteEstado!=null) {

            if (pacienteEstado.equals(pacienteEstado.ACTIVO)) {

                List<PacienteLeerDTO> pacientes = pacienteServicio.listarPacientesActivos();
                return new ResponseEntity<>(MensajeResponse.builder()
                        .mensaje("LISTA DE PACIENTES ACTIVOS")
                        .object(pacientes).build(), HttpStatus.OK);
            }

            if (pacienteEstado.equals(pacienteEstado.INACTIVO)) {

                List<PacienteLeerDTO> pacientes = pacienteServicio.listarPacientesInativos();
                return new ResponseEntity<>(MensajeResponse.builder()
                        .mensaje("LISTA DE PACIENTES INACTIVOS")
                        .object(pacientes).build(), HttpStatus.OK);
            }

        }

        List<PacienteLeerDTO> leerPacientes = pacienteServicio.listarPacientes();

        if (leerPacientes == null) {

            return new ResponseEntity<>(MensajeResponse.builder()
                    .mensaje("No existen pacientes todavia")
                    .object(null).build(), HttpStatus.NO_CONTENT);

        }

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("LISTA DE PACIENTES")
                .object(leerPacientes).build(), HttpStatus.OK);
    }

    @Operation(summary = "Obtener el paciente del usuario autenticado")
    @GetMapping("/actual")
    public ResponseEntity<MensajeResponse> pacienteActual(Authentication authentication){

        Paciente paciente = pacienteServicio.obtenerPorUsuario(authentication.getName())
                .orElseThrow(() -> new EntityNotFoundException("El usuario autenticado no es un paciente"));

        PacienteDetalleLeerDTO dto = pacienteServicio.traerPacientePorId(paciente.getId());

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("PACIENTE AUTENTICADO")
                .object(dto).build(), HttpStatus.OK);

    }

    @Operation(summary = "Obtener paciente por ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Paciente encontrado"),
            @ApiResponse(responseCode = "404", description = "Paciente no encontrado")
    })
    @GetMapping("/{id}")
    public ResponseEntity<MensajeResponse> leerPacientePorID(@PathVariable Integer id){

        PacienteDetalleLeerDTO dto = pacienteServicio.traerPacientePorId(id);
        if (dto==null){
            return new ResponseEntity<>(MensajeResponse.builder()
                    .mensaje("El paciente no existe")
                    .object(null).build(),HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("PACIENTE ENCONTRADO")
                .object(dto).build(),HttpStatus.OK);

    }

    @Operation(summary = "Listar nombres de pacientes")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de nombres obtenida correctamente"),
            @ApiResponse(responseCode = "404", description = "No existen pacientes")
    })
    @GetMapping("/resumen")
    public ResponseEntity<MensajeResponse> listaNombres() {
        List<NombrePacientesDTO> leerNombrePacientesDTOS = pacienteServicio.listarPacientesDtoList();

        if (leerNombrePacientesDTOS == null) {

            return new ResponseEntity<>(MensajeResponse.builder()
                    .mensaje("No existen pacientes todavia")
                    .object(null).build(), HttpStatus.NOT_FOUND);

        }
        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("LISTA DE PACIENTES")
                .object(leerNombrePacientesDTOS).build(), HttpStatus.OK);
    }

    @Operation(summary = "Actualizar paciente")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Paciente actualizado correctamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos"),
            @ApiResponse(responseCode = "404", description = "Paciente no encontrado")
    })
    @PutMapping("/{id}")
    public ResponseEntity<MensajeResponse> actualizarCitaMedica(
            @PathVariable Integer id,
            @Valid @RequestBody PacienteActualizarDTO actualizarDTO){

        PacienteRespuestaDTO paciente = pacienteServicio.actualizarRespuesta(actualizarDTO,id);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Cita Medica actualizada con exito")
                .object(paciente).build(), HttpStatus.CREATED);

    }

    @Operation(summary = "Eliminar paciente")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Paciente eliminado correctamente"),
            @ApiResponse(responseCode = "404", description = "Paciente no encontrado")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<MensajeResponse> eliminarPaciente(@PathVariable Integer id){

        pacienteServicio.eliminarPorId(id);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Paciente eliminado con exito")
                .object(null).build(),HttpStatus.NO_CONTENT);

    }

}