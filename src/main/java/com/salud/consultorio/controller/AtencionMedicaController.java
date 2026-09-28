package com.salud.consultorio.controller;

import com.salud.consultorio.dto.atencion.AtencionLeerDTO;
import com.salud.consultorio.model.payload.MensajeResponse;
import com.salud.consultorio.service.IAtencionMedicaServicio;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/atenciones")
@RequiredArgsConstructor
@Tag(
        name = "Atenciones",
        description = "Endpoints para la historia clínica y atenciones médicas"
)
public class AtencionMedicaController {

    private final IAtencionMedicaServicio atencionMedicaServicio;

    @Operation(summary = "Obtener la historia clínica (atenciones) de un paciente")
    @GetMapping("/paciente/{pacienteId}")
    public ResponseEntity<MensajeResponse> historiaPorPaciente(@PathVariable Integer pacienteId) {

        List<AtencionLeerDTO> historia = atencionMedicaServicio.historiaPorPaciente(pacienteId);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("HISTORIA CLINICA DEL PACIENTE")
                .object(historia).build(), HttpStatus.OK);

    }

    @Operation(summary = "Obtener la historia clínica del paciente autenticado")
    @GetMapping("/mias")
    public ResponseEntity<MensajeResponse> misAtenciones(Authentication authentication) {

        List<AtencionLeerDTO> historia = atencionMedicaServicio.historiaPorUsuario(authentication.getName());

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("MI HISTORIA CLINICA")
                .object(historia).build(), HttpStatus.OK);

    }

}
