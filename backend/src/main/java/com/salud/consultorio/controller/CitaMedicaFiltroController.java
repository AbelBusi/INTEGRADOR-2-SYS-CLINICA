package com.salud.consultorio.controller;

import com.salud.consultorio.dto.citaMedica.CitaMedicaFiltroDTO;
import com.salud.consultorio.model.payload.MensajeResponse;
import com.salud.consultorio.service.ICitaMedicaFiltroServicio;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/citas-medicas/filtros")
@RequiredArgsConstructor
@Tag(name = "Citas médicas - filtros", description = "Búsqueda dinámica y paginada de citas")
public class CitaMedicaFiltroController {

    private final ICitaMedicaFiltroServicio citaMedicaFiltroServicio;

    @Operation(
            summary = "Buscar citas con filtros combinables",
            description = "Todos los criterios son opcionales. Un MEDICO solo ve sus citas y un PACIENTE solo las suyas " +
                    "(se determina por el JWT). Nunca devuelve citas eliminadas (estado 0)."
    )
    @GetMapping
    public ResponseEntity<MensajeResponse> buscar(
            CitaMedicaFiltroDTO filtro,
            @PageableDefault(size = 10) Pageable pageable) {

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("RESULTADO DE CITAS FILTRADAS")
                .object(citaMedicaFiltroServicio.buscar(filtro, pageable))
                .build(), HttpStatus.OK);
    }
}