package com.salud.consultorio.auth.configuration;

import com.salud.consultorio.auth.service.IJwtServicio;
import com.salud.consultorio.repository.ITokenRepositorio;
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

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final IJwtServicio jwtServicio;
    private final ITokenRepositorio tokenRepositorio;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        if (request.getServletPath().contains("/api/v1/auth")){
            filterChain.doFilter(request, response);
            return;
        }

        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (authHeader == null || !authHeader.startsWith("Bearer ")){
            filterChain.doFilter(request, response);
            return;
        }

        final String jwtToken = authHeader.substring(7);
        final String usuario = jwtServicio.extraerUsuario(jwtToken);

        if (usuario != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            var tokenOptional = tokenRepositorio.findByToken(jwtToken);

            if (tokenOptional.isEmpty() || tokenOptional.get().isExpired() || tokenOptional.get().isRevoked()) {
                sendUnauthorizedResponse(response, "El token suministrado no es válido o ha sido revocado.");
                return;
            }

            List<String> rolesPermisos = jwtServicio.extraerPermisos(jwtToken);

            List<SimpleGrantedAuthority> authorities = rolesPermisos.stream()
                    .map(SimpleGrantedAuthority::new)
                    .toList();

            UserDetails userDetails = new User(usuario, "", authorities);

            if (jwtServicio.tokenValido(jwtToken, userDetails)) {
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
    }

    private void sendUnauthorizedResponse(HttpServletResponse response, String mensaje) throws IOException {
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(String.format("{\"error\": \"Unauthorized\", \"message\": \"%s\"}", mensaje));
    }
}