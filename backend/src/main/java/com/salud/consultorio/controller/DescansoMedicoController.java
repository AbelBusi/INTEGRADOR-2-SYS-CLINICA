package com.salud.consultorio.controller;

import com.salud.consultorio.dto.descansoMedico.DescansoMedicoContextoDTO;
import com.salud.consultorio.dto.descansoMedico.DescansoMedicoCrearDTO;
import com.salud.consultorio.dto.descansoMedico.DescansoMedicoRespuestaDTO;
import com.salud.consultorio.model.payload.MensajeResponse;
import com.salud.consultorio.service.IDescansoMedicoServicio;
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
@Tag(name = "Descansos médicos", description = "Emisión y consulta de descansos médicos asociados a una atención")
public class DescansoMedicoController {

    private final IDescansoMedicoServicio descansoMedicoServicio;

    @Operation(
            summary = "Consultar el descanso médico de una atención",
            description = "Devuelve el descanso emitido (si existe) o los datos automáticos del paciente y del médico " +
                    "junto con si se puede emitir, según las reglas validadas en el backend."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Información obtenida correctamente"),
            @ApiResponse(responseCode = "404", description = "Cita médica no encontrada")
    })
    @GetMapping("/cita/{idCita}")
    public ResponseEntity<MensajeResponse> contexto(@PathVariable Integer idCita) {

        DescansoMedicoContextoDTO contexto = descansoMedicoServicio.contexto(idCita);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Información del descanso médico")
                .object(contexto).build(), HttpStatus.OK);
    }

    @Operation(
            summary = "Emitir el descanso médico de una atención",
            description = "Una sola emisión por atención, dentro de las 24 horas posteriores a la atención y solo por " +
                    "el médico responsable. Valida el periodo, verifica el código de confirmación, firma " +
                    "electrónicamente (firma interna, no certificada) y registra la auditoría."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Descanso médico generado correctamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos, plazo vencido o código incorrecto"),
            @ApiResponse(responseCode = "403", description = "El usuario no es el médico responsable"),
            @ApiResponse(responseCode = "404", description = "Cita médica no encontrada"),
            @ApiResponse(responseCode = "409", description = "Ya existe un descanso médico para la atención")
    })
    @PostMapping("/cita/{idCita}")
    public ResponseEntity<MensajeResponse> emitir(
            @PathVariable Integer idCita,
            @Valid @RequestBody DescansoMedicoCrearDTO dto,
            HttpServletRequest request) {

        DescansoMedicoRespuestaDTO descanso =
                descansoMedicoServicio.emitir(idCita, dto, IpClienteUtil.obtener(request));

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Descanso médico generado con éxito")
                .object(descanso).build(), HttpStatus.CREATED);
    }
}