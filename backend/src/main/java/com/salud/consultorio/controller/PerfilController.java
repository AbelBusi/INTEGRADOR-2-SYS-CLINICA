package com.salud.consultorio.controller;

import com.salud.consultorio.dto.perfil.ActualizarContactoRequest;
import com.salud.consultorio.dto.perfil.CambiarClavePerfilRequest;
import com.salud.consultorio.dto.perfil.ConfirmarCambioCorreoRequest;
import com.salud.consultorio.dto.perfil.PerfilDTO;
import com.salud.consultorio.dto.perfil.SolicitarCambioCorreoRequest;
import com.salud.consultorio.model.payload.MensajeResponse;
import com.salud.consultorio.service.IPerfilServicio;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/perfil")
@RequiredArgsConstructor
public class PerfilController {

    private final IPerfilServicio perfilServicio;

    @GetMapping
    public ResponseEntity<MensajeResponse> obtener(Authentication authentication) {

        if (sinSesion(authentication)) {
            return noAutenticado();
        }

        PerfilDTO perfil = perfilServicio.obtener(authentication.getName());

        return ResponseEntity.ok(MensajeResponse.builder()
                .mensaje("PERFIL ENCONTRADO")
                .object(perfil).build());
    }

    @PutMapping("/contacto")
    public ResponseEntity<MensajeResponse> actualizarContacto(
            Authentication authentication,
            @Valid @RequestBody ActualizarContactoRequest dto) {

        if (sinSesion(authentication)) {
            return noAutenticado();
        }

        PerfilDTO perfil = perfilServicio.actualizarContacto(authentication.getName(), dto);

        return ResponseEntity.ok(MensajeResponse.builder()
                .mensaje("DATOS DE CONTACTO ACTUALIZADOS CORRECTAMENTE")
                .object(perfil).build());
    }

    @PostMapping("/correo/solicitar")
    public ResponseEntity<MensajeResponse> solicitarCambioCorreo(
            Authentication authentication,
            @Valid @RequestBody SolicitarCambioCorreoRequest dto) {

        if (sinSesion(authentication)) {
            return noAutenticado();
        }

        String destino = perfilServicio.solicitarCambioCorreo(authentication.getName(), dto.nuevoCorreo());

        return ResponseEntity.ok(MensajeResponse.builder()
                .mensaje("Enviamos un código de verificación a " + destino)
                .object(destino).build());
    }

    @PostMapping("/correo/confirmar")
    public ResponseEntity<MensajeResponse> confirmarCambioCorreo(
            Authentication authentication,
            @Valid @RequestBody ConfirmarCambioCorreoRequest dto) {

        if (sinSesion(authentication)) {
            return noAutenticado();
        }

        PerfilDTO perfil = perfilServicio.confirmarCambioCorreo(authentication.getName(), dto.codigo());

        return ResponseEntity.ok(MensajeResponse.builder()
                .mensaje("CORREO ACTUALIZADO CORRECTAMENTE")
                .object(perfil).build());
    }

    @PutMapping("/clave")
    public ResponseEntity<MensajeResponse> cambiarClave(
            Authentication authentication,
            @Valid @RequestBody CambiarClavePerfilRequest dto) {

        if (sinSesion(authentication)) {
            return noAutenticado();
        }

        perfilServicio.cambiarClave(authentication.getName(), dto);

        return ResponseEntity.ok(MensajeResponse.builder()
                .mensaje("Contraseña actualizada correctamente. Inicia sesión con tu nueva contraseña")
                .build());
    }

    private ResponseEntity<MensajeResponse> noAutenticado() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(MensajeResponse.builder()
                        .mensaje("Debes iniciar sesión para acceder a tu perfil")
                        .build());
    }

    private boolean sinSesion(Authentication authentication) {
        return authentication == null
                || !authentication.isAuthenticated()
                || authentication instanceof AnonymousAuthenticationToken;
    }
}