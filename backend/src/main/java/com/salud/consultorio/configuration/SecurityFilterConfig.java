package com.salud.consultorio.configuration;

import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityFilterConfig {

    @Bean
    public SecurityFilterChain securityFilterChain (@NonNull HttpSecurity http) throws Exception{

        http
                .cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth-> auth
                        .requestMatchers("api/v1/pacientes/**").permitAll()
                        .requestMatchers("api/v1/especialidades/**").permitAll()
                        .requestMatchers("api/v1/empleados/**").permitAll()
                        .requestMatchers("api/v1/horarios/**").permitAll()
                        .requestMatchers("api/v1/doctores/**").permitAll()
                        .requestMatchers("api/v1/cargos/**").permitAll()
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                        .anyRequest().authenticated()
                );

        return http.build();

    }

}