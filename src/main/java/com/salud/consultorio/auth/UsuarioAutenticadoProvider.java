package com.salud.consultorio.auth;

import com.salud.consultorio.model.entity.Usuario;
import com.salud.consultorio.repository.IUsuarioRepositorio;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UsuarioAutenticadoProvider {

    private final IUsuarioRepositorio usuarioRepositorio;

    public Usuario obtener() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated() || auth instanceof AnonymousAuthenticationToken) {
            throw new AuthenticationCredentialsNotFoundException("No se pudo identificar al usuario autenticado.");
        }

        return usuarioRepositorio.findByUsuario(auth.getName()).orElseThrow(
                () -> new EntityNotFoundException("No existe el usuario autenticado")
        );

    }

}