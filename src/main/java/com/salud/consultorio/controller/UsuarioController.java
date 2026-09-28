package com.salud.consultorio.controller;

import com.salud.consultorio.dto.usuario.UsuarioListaDTO;
import com.salud.consultorio.model.enums.EntidadEstado;
import com.salud.consultorio.model.payload.MensajeResponse;
import com.salud.consultorio.service.IUsuarioServicio;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/usuarios")
@RequiredArgsConstructor
@Tag(
        name = "Usuarios",
        description = "Endpoints para la gestión de usuarios del sistema"
)
public class UsuarioController {

    private final IUsuarioServicio usuarioServicio;

    @GetMapping("/{id}/rol")
    @Operation(
            summary = "Obtener nombre completo y rol de un usuario",
            description = "Devuelve el nombre completo y el rol en mayúsculas envueltos en un MensajeResponse."
    )
    @ApiResponse(responseCode = "200", description = "Usuario encontrado con éxito")
    @ApiResponse(responseCode = "404", description = "Usuario no encontrado")
    public ResponseEntity<MensajeResponse> obtenerUsuarioYRolPorId(@PathVariable Integer id) {
        return usuarioServicio.obtenerInformacionUsuarioYRol(id)
                .map(dto -> ResponseEntity.ok(
                        MensajeResponse.builder()
                                .mensaje("Información del usuario obtenida correctamente.")
                                .object(dto)
                                .build()
                ))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                        MensajeResponse.builder()
                                .mensaje("El usuario con el ID proporcionado no existe.")
                                .object(null)
                                .build()
                ));
    }


    @GetMapping("/{id}")
    @Operation(
            summary = "Obtener el detalle de un usuario",
            description = "Devuelve la información completa del usuario (persona, rol, estado y tipo) envuelta en un MensajeResponse."
    )
    @ApiResponse(responseCode = "200", description = "Usuario encontrado con éxito")
    @ApiResponse(responseCode = "404", description = "Usuario no encontrado")
    public ResponseEntity<MensajeResponse> leerUsuarioPorId(@PathVariable Integer id) {
        return usuarioServicio.obtenerDetallePorId(id)
                .map(dto -> ResponseEntity.ok(
                        MensajeResponse.builder()
                                .mensaje("Detalle del usuario obtenido correctamente.")
                                .object(dto)
                                .build()
                ))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                        MensajeResponse.builder()
                                .mensaje("El usuario con el ID proporcionado no existe.")
                                .object(null)
                                .build()
                ));
    }

    @Operation(summary = "Listar usuarios")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de usuarios obtenida correctamente")
    })
    @GetMapping
    public ResponseEntity<MensajeResponse> leerUsuarios(
            @RequestParam(required = false,name = "estado") EntidadEstado estado){

        if (estado!=null){

            if (estado.equals(estado.ACTIVO)){
                List<UsuarioListaDTO> usuarios =usuarioServicio.listaUsuariosActivos();
                return new ResponseEntity<>(MensajeResponse.builder()
                        .mensaje("LISTA DE USUARIOS POR ESTADO ACTIVO")
                        .object(usuarios).build(),HttpStatus.OK);
            }

            if (estado.equals(estado.INACTIVO)){
                List<UsuarioListaDTO> usuarios =usuarioServicio.listaUsuariosInactivos();
                return new ResponseEntity<>(MensajeResponse.builder()
                        .mensaje("LISTA DE USUARIOS POR ESTADO INACTIVO")
                        .object(usuarios).build(),HttpStatus.OK);
            }

        }

        List<UsuarioListaDTO> usuarios =usuarioServicio.listaUsuarios();

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("LISTA DE USUARIOS")
                .object(usuarios).build(),HttpStatus.OK);

    }

    @Operation(summary = "Eliminar usuarios")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Usuario eliminado correctamente"),
            @ApiResponse(responseCode = "404", description = "Usuario no encontrado")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<MensajeResponse> eliminarUsuarioPorId(@PathVariable Integer id){

        usuarioServicio.eliminarPorId(id);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Usuario eliminado con exito")
                .object(null).build(),HttpStatus.NO_CONTENT);

    }

}