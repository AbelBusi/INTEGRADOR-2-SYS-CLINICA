package com.salud.consultorio.auth.configuration;

import com.salud.consultorio.auth.dto.TokenSesionDTO;
import com.salud.consultorio.auth.service.IJwtServicio;
import com.salud.consultorio.repository.ITokenRepositorio;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private static final Set<String> RUTAS_PUBLICAS = Set.of(
            "/api/v1/auth/login",
            "/api/v1/auth/refresh",
            "/api/v1/auth/logout",
            "/api/v1/auth/recuperar-clave",
            "/api/v1/auth/verificar-codigo",
            "/api/v1/auth/restablecer-clave"
    );

    private static final String RUTA_CAMBIO_CLAVE = "/api/v1/auth/cambiar-clave";

    private static final String MENSAJE_INACTIVO =
            "Tu cuenta está desactivada. Comunícate con el administrador del sistema.";

    private static final String MENSAJE_CAMBIO_CLAVE =
            "Debes cambiar tu contraseña temporal para continuar";

    private static final String MENSAJE_TOKEN_INVALIDO =
            "El token suministrado no es válido o ha sido revocado.";

    private final IJwtServicio jwtServicio;
    private final ITokenRepositorio tokenRepositorio;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        final String ruta = request.getServletPath();

        if (RUTAS_PUBLICAS.contains(ruta)) {
            filterChain.doFilter(request, response);
            return;
        }

        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String jwtToken = authHeader.substring(7);

        try {

            final String usuario = jwtServicio.extraerUsuario(jwtToken);

            if (usuario != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                Optional<TokenSesionDTO> sesion = tokenRepositorio.buscarSesion(jwtToken);

                if (sesion.isEmpty() || sesion.get().expirado() || sesion.get().revocado()) {
                    sendUnauthorizedResponse(response, MENSAJE_TOKEN_INVALIDO);
                    return;
                }

                TokenSesionDTO datos = sesion.get();

                if (!Integer.valueOf(1).equals(datos.estado())) {
                    SecurityContextHolder.clearContext();
                    sendUnauthorizedResponse(response, MENSAJE_INACTIVO);
                    return;
                }

                List<String> rolesPermisos = jwtServicio.extraerPermisos(jwtToken);

                List<SimpleGrantedAuthority> authorities = rolesPermisos.stream()
                        .map(SimpleGrantedAuthority::new)
                        .toList();

                UserDetails userDetails = new User(usuario, "", authorities);

                if (jwtServicio.tokenValido(jwtToken, userDetails)) {

                    if (datos.requiereCambioClave() && !RUTA_CAMBIO_CLAVE.equals(ruta)) {
                        sendCambioClaveRequerido(response);
                        return;
                    }

                    final var authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );

                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                } else {
                    sendUnauthorizedResponse(response, "Firma del token inválida.");
                    return;
                }
            }

            filterChain.doFilter(request, response);

        } catch (ExpiredJwtException e) {
            SecurityContextHolder.clearContext();
            sendUnauthorizedResponse(response, "El token ha expirado");
        } catch (JwtException e) {
            SecurityContextHolder.clearContext();
            sendUnauthorizedResponse(response, "El token suministrado no es valido");
        }

    }

    private void sendUnauthorizedResponse(HttpServletResponse response, String mensaje) throws IOException {
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(String.format("{\"error\": \"Unauthorized\", \"message\": \"%s\"}", mensaje));
    }

    private void sendCambioClaveRequerido(HttpServletResponse response) throws IOException {
        response.setStatus(HttpStatus.FORBIDDEN.value());
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(String.format(
                "{\"mensaje\": \"%s\", \"codigo\": \"CAMBIO_CLAVE_REQUERIDO\"}", MENSAJE_CAMBIO_CLAVE));
    }
}