package com.salud.consultorio.controller;

import com.salud.consultorio.dto.atencionClinica.AtencionClinicaRespuestaDTO;
import com.salud.consultorio.model.payload.MensajeResponse;
import com.salud.consultorio.service.IAtencionClinicaServicio;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/citas-medicas/{idCita}/atencion-clinica")
@RequiredArgsConstructor
@Tag(name = "Atención clínica", description = "Consulta consolidada de la información clínica de una cita médica")
public class AtencionClinicaController {

    private final IAtencionClinicaServicio atencionClinicaServicio;

    @Operation(
            summary = "Consultar la atención clínica completa de una cita",
            description = "Devuelve la cita y sus diagnósticos activos, cada uno con sus tratamientos, indicaciones, " +
                    "exámenes solicitados y derivaciones activos. Solo el médico asignado a la cita."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Información clínica obtenida correctamente"),
            @ApiResponse(responseCode = "403", description = "La cita no pertenece al médico autenticado"),
            @ApiResponse(responseCode = "404", description = "Cita médica no encontrada")
    })
    @GetMapping
    public ResponseEntity<MensajeResponse> detalle(@PathVariable Integer idCita) {

        AtencionClinicaRespuestaDTO respuesta = atencionClinicaServicio.detallePorCita(idCita);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("ATENCION CLINICA DE LA CITA MEDICA")
                .object(respuesta).build(), HttpStatus.OK);

    }

}