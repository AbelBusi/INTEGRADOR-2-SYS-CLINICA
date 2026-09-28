package com.salud.consultorio.controller;

import com.salud.consultorio.dto.atencion.AtencionCrearDTO;
import com.salud.consultorio.dto.citaMedica.*;
import com.salud.consultorio.model.enums.EntidadEstado;
import com.salud.consultorio.model.payload.MensajeResponse;
import com.salud.consultorio.service.IAtencionMedicaServicio;
import com.salud.consultorio.service.ICitaMedicaServicio;
import com.salud.consultorio.service.IRecepcionistaServicio;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/citas-medicas")
@RequiredArgsConstructor
@Tag(
        name = "Citas Médicas",
        description = "Endpoints para la gestión de citas médicas"
)
public class CitaMedicaController {

    private final ICitaMedicaServicio citaMedicaServicio;
    private final IRecepcionistaServicio recepcionistaServicio;
    private final IAtencionMedicaServicio atencionMedicaServicio;

    @Operation(summary = "Registrar una nueva cita médica")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Cita médica registrada correctamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos")
    })
    @PostMapping
    public ResponseEntity<MensajeResponse> crear(@Valid @RequestBody CitaMedicaCrearDTO dto, Authentication authentication){

        recepcionistaServicio.obtenerPorUsuario(authentication.getName())
                .ifPresent(recepcionista -> dto.getRecepcionista().setId(recepcionista.getId()));

        CitaMedicaRespuestaDTO citaMedica =citaMedicaServicio.crearCita(dto);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Cita Medica agregada con exito")
                .object(citaMedica).build(), HttpStatus.CREATED);

    }

    @Operation(summary = "Listar las citas registradas por el recepcionista autenticado")
    @GetMapping("/mias")
    public ResponseEntity<MensajeResponse> misCitas(Authentication authentication){

        List<CitaMedicaLeerDTO> citas = citaMedicaServicio.leerCitasPorRecepcionista(authentication.getName());

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("HISTORIAL DE CITAS DEL RECEPCIONISTA")
                .object(citas).build(), HttpStatus.OK);

    }

    @Operation(summary = "Listar las citas del doctor autenticado por estado")
    @GetMapping("/doctor/mias")
    public ResponseEntity<MensajeResponse> misCitasDoctor(
            @RequestParam Integer estado,
            Authentication authentication){

        List<DoctorCitaDTO> citas = citaMedicaServicio.citasDoctor(authentication.getName(), estado);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("CITAS DEL DOCTOR")
                .object(citas).build(), HttpStatus.OK);

    }

    @Operation(summary = "Listar las citas del paciente autenticado")
    @GetMapping("/paciente/mias")
    public ResponseEntity<MensajeResponse> misCitasPaciente(Authentication authentication){

        List<PacienteCitaDTO> citas = citaMedicaServicio.citasPaciente(authentication.getName());

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("CITAS DEL PACIENTE")
                .object(citas).build(), HttpStatus.OK);

    }

    @Operation(summary = "Atender y cerrar una cita registrando la información clínica")
    @PostMapping("/{id}/atender")
    public ResponseEntity<MensajeResponse> atenderCita(
            @PathVariable Integer id,
            @Valid @RequestBody AtencionCrearDTO dto,
            Authentication authentication){

        atencionMedicaServicio.atenderCita(id, authentication.getName(), dto);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("La cita fue atendida y registrada en la historia clínica")
                .object(null).build(), HttpStatus.OK);

    }

    @Operation(summary = "Obtener cita médica por ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Cita médica encontrada"),
            @ApiResponse(responseCode = "404", description = "Cita médica no encontrada")
    })
    @GetMapping("/{id}")
    public ResponseEntity<MensajeResponse> leerCitaMedica(@PathVariable Integer id){

        CitaMedicaLeerDTO dto= citaMedicaServicio.mostrarCitaMedicaPorId(id);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Cita Medica encontrada")
                .object(dto).build(),HttpStatus.OK);

    }

    @Operation(summary = "Listar citas médicas")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de citas médicas obtenida correctamente")
    })
    @GetMapping
    public ResponseEntity<MensajeResponse> leerCitas(
            @RequestParam(required = false,name = "estado") EntidadEstado estado){

        if (estado!=null){

            if (estado.equals(estado.ACTIVO)){
                List<CitaMedicaLeerDTO> doctores =citaMedicaServicio.leerCitasMedicasActivas();
                return new ResponseEntity<>(MensajeResponse.builder()
                        .mensaje("LISTA DE CITAS MEDICAS POR ESTADO ACTIVO")
                        .object(doctores).build(),HttpStatus.OK);
            }

            if (estado.equals(estado.INACTIVO)){
                List<CitaMedicaLeerDTO> doctores =citaMedicaServicio.leerCitasMedicasInactivas();
                return new ResponseEntity<>(MensajeResponse.builder()
                        .mensaje("LISTA DE CITAS MEDICAS POR ESTADO INACTIVO")
                        .object(doctores).build(),HttpStatus.OK);
            }

        }
        List<CitaMedicaLeerDTO> doctores =citaMedicaServicio.leerCitasMedicas();

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("LISTA DE CITAS MEDICAS")
                .object(doctores).build(),HttpStatus.OK);

    }

    @Operation(summary = "Actualizar cita médica")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Cita médica actualizada correctamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos"),
            @ApiResponse(responseCode = "404", description = "Cita médica no encontrada")
    })
    @PutMapping("/{id}")
    public ResponseEntity<MensajeResponse> actualizarCitaMedica(@PathVariable Integer id, @Valid @RequestBody CitaMedicaActualizarDTO citaMedicaActualizarDTO){

        CitaMedicaActualizarRespuestaDTO citaMedica = citaMedicaServicio.actualizar(citaMedicaActualizarDTO,id);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Cita Medica actualizada con exito")
                .object(citaMedica).build(), HttpStatus.CREATED);

    }

    @Operation(summary = "Eliminar cita médica")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Cita médica eliminada correctamente"),
            @ApiResponse(responseCode = "404", description = "Cita médica no encontrada")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<MensajeResponse> eliminarCitaMedica(@PathVariable Integer id){

        if (!citaMedicaServicio.obtenerPorId(id).isPresent()){

            return new ResponseEntity<>(MensajeResponse.builder()
                    .mensaje("La cita medica no se puede eliminar porque no existe")
                    .object(null).build(),HttpStatus.NOT_FOUND);
        }

        citaMedicaServicio.eliminarPorId(id);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("La cita medica se elimino con exito")
                .object(null).build(),HttpStatus.NO_CONTENT);
    }

}