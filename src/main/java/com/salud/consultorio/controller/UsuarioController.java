package com.salud.consultorio.controller;

import com.salud.consultorio.auth.service.IAuthServicio;
import com.salud.consultorio.dto.usuario.UsuarioAltaDTO;
import com.salud.consultorio.dto.usuario.UsuarioCambiarRolDTO;
import com.salud.consultorio.dto.usuario.UsuarioCreadoDTO;
import com.salud.consultorio.dto.usuario.UsuarioListadoDTO;
import com.salud.consultorio.model.enums.EntidadEstado;
import com.salud.consultorio.model.payload.MensajeResponse;
import com.salud.consultorio.service.IUsuarioServicio;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/v1/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final IUsuarioServicio usuarioServicio;
    private final IAuthServicio authServicio;

    @GetMapping("/{id}/rol")
    public ResponseEntity<Map<String, Object>> obtenerUsuarioYRol(@PathVariable Integer id) {
        return usuarioServicio.obtenerInformacionUsuarioYRol(id)
                .map(info -> ResponseEntity.ok(Map.of(
                        "mensaje", "Usuario encontrado",
                        "object", info)))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("mensaje", "Usuario no encontrado")));
    }

    @Operation(
            summary = "Cambiar el rol de un empleado",
            description = "No permite cambiar el propio rol, ni el de pacientes, ni asignar el rol PACIENTE. Revoca las sesiones del usuario."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Rol actualizado correctamente"),
            @ApiResponse(responseCode = "400", description = "Operación no permitida o datos inválidos"),
            @ApiResponse(responseCode = "404", description = "Usuario o rol no encontrado")
    })
    @PreAuthorize("hasAuthority('USUARIOS_GESTIONAR')")
    @PatchMapping("/{id}/rol")
    public ResponseEntity<MensajeResponse> cambiarRol(
            @PathVariable Integer id,
            @Valid @RequestBody UsuarioCambiarRolDTO dto,
            Authentication authentication
    ) {

        authServicio.cambiarRol(id, dto, authentication.getName());

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("ROL DEL USUARIO ACTUALIZADO CORRECTAMENTE")
                .build(), HttpStatus.OK);

    }

    @PatchMapping("/{id}")
    public ResponseEntity<MensajeResponse> cambiarEstado(
            @PathVariable Integer id,
            @RequestParam(name = "estado", required = true) EntidadEstado estado,
            Authentication authentication
    ) {

        authServicio.validarNoEsCuentaPropia(
                id,
                authentication.getName(),
                "No puedes cambiar el estado de tu propia cuenta"
        );

        usuarioServicio.cambiarEstado(id, estado);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("ESTADO DEL USUARIO CAMBIADO CORRECTAMENTE")
                .build(), HttpStatus.OK);

    }

    @Operation(summary = "Listar usuarios por estado")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de usuarios obtenida correctamente")
    })
    @GetMapping
    public ResponseEntity<MensajeResponse> listar(
            @RequestParam(required = false, name = "estado") EntidadEstado estado) {

        List<UsuarioListadoDTO> listaEntidades = usuarioServicio.lista(estado);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("LISTA DE USUARIOS")
                .object(listaEntidades).build(), HttpStatus.OK);

    }

    @Operation(summary = "Listar usuarios empleados por estado")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de usuarios obtenida correctamente")
    })
    @GetMapping("empleados")
    public ResponseEntity<MensajeResponse> listarEmpleados(
            @RequestParam(required = false, name = "estado") EntidadEstado estado) {

        List<UsuarioListadoDTO> listaEntidades = usuarioServicio.listaEmpleados(estado);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("LISTA DE USUARIOS")
                .object(listaEntidades).build(), HttpStatus.OK);

    }

    @Operation(summary = "Listar usuarios pacientes por estado")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de usuarios obtenida correctamente")
    })
    @GetMapping("pacientes")
    public ResponseEntity<MensajeResponse> listarPacientes(
            @RequestParam(required = false, name = "estado") EntidadEstado estado) {

        List<UsuarioListadoDTO> listaEntidades = usuarioServicio.listaPacientes(estado);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("LISTA DE USUARIOS")
                .object(listaEntidades).build(), HttpStatus.OK);

    }

    @Operation(
            summary = "Crear usuario para un paciente o empleado",
            description = "Genera usuario y clave temporal automáticamente y envía las credenciales al correo registrado. La clave nunca se devuelve."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Usuario creado y credenciales enviadas"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos o la persona no tiene correo"),
            @ApiResponse(responseCode = "404", description = "Persona o rol no encontrado"),
            @ApiResponse(responseCode = "409", description = "La persona ya tiene usuario")
    })
    @PostMapping
    public ResponseEntity<MensajeResponse> crear(@Valid @RequestBody UsuarioAltaDTO dto) {

        UsuarioCreadoDTO usuario = authServicio.crearUsuario(dto);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Usuario creado y credenciales enviadas al correo registrado")
                .object(usuario).build(), HttpStatus.CREATED);

    }

}