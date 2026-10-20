package com.salud.consultorio.controller;

import com.salud.consultorio.auth.service.IAuthServicio;
import com.salud.consultorio.dto.usuario.UsuarioAltaDTO;
import com.salud.consultorio.dto.usuario.UsuarioCreadoDTO;
import com.salud.consultorio.dto.usuario.UsuarioListadoDTO;
import com.salud.consultorio.dto.usuario.UsuarioRolAsignarDTO;
import com.salud.consultorio.dto.usuario.UsuarioRolesDTO;
import com.salud.consultorio.model.enums.EntidadEstado;
import com.salud.consultorio.model.payload.MensajeResponse;
import com.salud.consultorio.service.IUsuarioRolServicio;
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

@RestController
@RequestMapping("api/v1/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final IUsuarioServicio usuarioServicio;
    private final IUsuarioRolServicio usuarioRolServicio;
    private final IAuthServicio authServicio;

    @Operation(summary = "Obtener un usuario con todos sus roles activos")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Usuario encontrado"),
            @ApiResponse(responseCode = "404", description = "Usuario no encontrado")
    })
    @GetMapping("/{id}/roles")
    public ResponseEntity<MensajeResponse> obtenerUsuarioYRoles(@PathVariable Integer id) {

        UsuarioRolesDTO info = usuarioServicio.obtenerInformacionUsuarioYRol(id);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("USUARIO ENCONTRADO")
                .object(info).build(), HttpStatus.OK);

    }

    @Operation(
            summary = "Asignar un rol a un empleado",
            description = "Un usuario puede tener varios roles. No permite modificar los roles de la cuenta propia, "
                    + "ni de pacientes, ni asignar el rol PACIENTE. Revoca las sesiones del usuario."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Rol asignado correctamente"),
            @ApiResponse(responseCode = "400", description = "Operación no permitida o datos inválidos"),
            @ApiResponse(responseCode = "404", description = "Usuario o rol no encontrado")
    })

    @PostMapping("/{id}/roles")
    public ResponseEntity<MensajeResponse> asignarRol(
            @PathVariable Integer id,
            @Valid @RequestBody UsuarioRolAsignarDTO dto,
            Authentication authentication
    ) {

        authServicio.validarNoEsCuentaPropia(
                id,
                authentication.getName(),
                "No puedes modificar los roles de tu propia cuenta"
        );

        usuarioRolServicio.asignarRol(id, dto.idRol());

        authServicio.revocarSesionesUsuario(id);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("ROL ASIGNADO CORRECTAMENTE")
                .build(), HttpStatus.OK);

    }

    @Operation(
            summary = "Revocar un rol de un empleado",
            description = "Revocación lógica. No permite revocar el único rol activo del usuario "
                    + "ni modificar la cuenta propia. Revoca las sesiones del usuario."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Rol revocado correctamente"),
            @ApiResponse(responseCode = "400", description = "Operación no permitida"),
            @ApiResponse(responseCode = "404", description = "El usuario no tiene asignado ese rol")
    })
    @PreAuthorize("hasAuthority('USUARIOS_GESTIONAR')")
    @DeleteMapping("/{id}/roles/{idRol}")
    public ResponseEntity<MensajeResponse> revocarRol(
            @PathVariable Integer id,
            @PathVariable Integer idRol,
            Authentication authentication
    ) {

        authServicio.validarNoEsCuentaPropia(
                id,
                authentication.getName(),
                "No puedes modificar los roles de tu propia cuenta"
        );

        usuarioRolServicio.revocarRol(id, idRol);

        authServicio.revocarSesionesUsuario(id);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("ROL REVOCADO CORRECTAMENTE")
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

    @Operation(summary = "Listar usuarios por estado (incluye sus roles)")
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
                .mensaje("LISTA DE USUARIOS EMPLEADOS")
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
                .mensaje("LISTA DE USUARIOS PACIENTES")
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