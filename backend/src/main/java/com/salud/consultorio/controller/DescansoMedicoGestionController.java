package com.salud.consultorio.controller;

import com.salud.consultorio.dto.descansoMedico.DescansoMedicoCancelarDTO;
import com.salud.consultorio.model.payload.MensajeResponse;
import com.salud.consultorio.service.IDescansoMedicoGestionServicio;
import com.salud.consultorio.util.IpClienteUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/descansos-medicos")
@RequiredArgsConstructor
@Tag(name = "Documentos emitidos (descansos médicos)",
        description = "Listado de los descansos emitidos por el médico, su historial de auditoría y su cancelación")
public class DescansoMedicoGestionController {

    private final IDescansoMedicoGestionServicio gestionServicio;

    @Operation(summary = "Listar los descansos médicos emitidos por el usuario autenticado",
            description = "Incluye los cancelados, que se conservan con estado CANCELADO.")
    @GetMapping("/mis-documentos")
    public ResponseEntity<MensajeResponse> misDocumentos() {
        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("MIS DESCANSOS MEDICOS EMITIDOS")
                .object(gestionServicio.listarMisDocumentos()).build(), HttpStatus.OK);
    }

    @Operation(summary = "Historial de auditoría de un descanso médico",
            description = "Eventos en orden cronológico: emisión, intentos con código incorrecto y cancelación.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Historial obtenido correctamente"),
            @ApiResponse(responseCode = "404", description = "Descanso médico no encontrado")
    })
    @GetMapping("/{idDescanso}/historial")
    public ResponseEntity<MensajeResponse> historial(@PathVariable Integer idDescanso) {
        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("HISTORIAL DEL DESCANSO MEDICO")
                .object(gestionServicio.historial(idDescanso)).build(), HttpStatus.OK);
    }

    @Operation(summary = "Cancelar un descanso médico",
            description = "No elimina el documento: queda registrado como CANCELADO. Solo el médico emisor, " +
                    "con motivo obligatorio y código de verificación. Una sola cancelación por documento.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Descanso médico cancelado correctamente"),
            @ApiResponse(responseCode = "400", description = "Motivo faltante o código incorrecto"),
            @ApiResponse(responseCode = "403", description = "El usuario no emitió el documento"),
            @ApiResponse(responseCode = "404", description = "Descanso médico no encontrado"),
            @ApiResponse(responseCode = "409", description = "El descanso ya está cancelado")
    })
    @PatchMapping("/{idDescanso}/cancelar")
    public ResponseEntity<MensajeResponse> cancelar(
            @PathVariable Integer idDescanso,
            @Valid @RequestBody DescansoMedicoCancelarDTO dto,
            HttpServletRequest request) {

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Descanso médico cancelado con éxito")
                .object(gestionServicio.cancelar(idDescanso, dto, IpClienteUtil.obtener(request))).build(),
                HttpStatus.OK);
    }
}