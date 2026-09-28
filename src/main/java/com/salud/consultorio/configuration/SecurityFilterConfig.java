package com.salud.consultorio.configuration;

import com.salud.consultorio.auth.configuration.JwtAuthFilter;
import com.salud.consultorio.model.entity.Token;
import com.salud.consultorio.repository.ITokenRepositorio;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityFilterConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;
    private final ITokenRepositorio tokenRepositorio;

    @Bean
    public SecurityFilterChain securityFilterChain(@NonNull HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth ->auth
                        .requestMatchers("/api/v1/auth/**").permitAll()
                        .requestMatchers("/api/v1/pacientes/**").authenticated()
                        .requestMatchers("/api/v1/recepcionistas/**").authenticated()
                        .requestMatchers("/api/v1/doctores/**").authenticated()
                        .requestMatchers("/api/v1/usuarios").authenticated()
                        .requestMatchers("/api/v1/citas-medicas/**").authenticated()
                        .requestMatchers("/swagger-ui/**","v3/api-docs/**").permitAll()
                        .anyRequest().authenticated()
                ).sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .logout(logout ->
                        logout.logoutUrl("/api/v1/auth/logout")
                                .addLogoutHandler((request, response, authentication) -> {
                                    final var authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
                                    logout(authHeader);
                                }));

        return http.build();

    }

    private void logout(final String token){

        if (token == null || !token.startsWith("Bearer ")){

            throw new IllegalArgumentException("Token Invalido");

        }

        final String jwtToken = token.substring(7);
        final Token foundToken = tokenRepositorio.findByToken(jwtToken)
                .orElseThrow(()-> new IllegalArgumentException("Invalid Token"));
        foundToken.setExpired(true);
        foundToken.setRevoked(true);
        tokenRepositorio.save(foundToken);

    }

}