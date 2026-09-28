package com.salud.consultorio.controller;

import com.salud.consultorio.dto.persona.PersonaCrearDTO;
import com.salud.consultorio.dto.persona.PersonaLeerDTO;
import com.salud.consultorio.model.entity.Persona;
import com.salud.consultorio.model.payload.MensajeResponse;
import com.salud.consultorio.service.IPersonaServicio;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/v1/personas")
@RequiredArgsConstructor
@Tag(
        name = "Personas",
        description = "Endpoints para la gestión de personas"
)
public class PersonaController {

    private final IPersonaServicio personaServicio;

    @Operation(summary = "Registrar una nueva persona")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Persona registrada correctamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos")
    })
    @PostMapping
    public ResponseEntity<?> crearPersona(@Valid @RequestBody PersonaCrearDTO personaCrearDTO){

        Persona persona =personaServicio.crear(personaCrearDTO);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Persona agregada con exito")
                .object(personaCrearDTO).build(), HttpStatus.CREATED);

    }

    @Operation(summary = "Listar personas sin cuenta de usuario")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de personas sin cuenta obtenida correctamente")
    })
    @GetMapping("/sin-cuenta")
    public ResponseEntity<MensajeResponse> listarPersonasSinCuenta(){

        List<PersonaLeerDTO> personas = personaServicio.listarPersonasSinCuenta();

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("LISTA DE PERSONAS SIN CUENTA")
                .object(personas).build(), HttpStatus.OK);

    }

}